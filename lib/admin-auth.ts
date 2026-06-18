// 后台管理员登录 —— 基于 Supabase Auth（邮箱+密码）
// 登录成功后必须再校验 admins 白名单，否则无后台权限
import { supabase, isSupabaseConfigured } from "./supabase";

export interface AdminInfo {
  email: string;
}

// 给任何 Promise 套一个超时兜底。
// 关键：Supabase 网络请求若因配置错误/DNS 失败而长时间挂起（不 reject 也不 resolve），
// 调用方的 .then/.finally 永远不触发 → 永久 loading → 视觉黑屏。
// 超时后强制 resolve，保证 UI 不卡死。
function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

// 邮箱密码登录，并校验是否在 admins 白名单
export async function signInAdmin(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    return { error: "未配置 Supabase，请先按 SUPABASE_SETUP.md 完成配置" };
  }
  try {
    const task = (async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };

      // 校验管理员白名单（RLS 下，非管理员此处查不到行）
      const { data } = await supabase.from("admins").select("email").limit(1);
      if (!data || data.length === 0) {
        await supabase.auth.signOut();
        return { error: "该账号无后台管理权限" };
      }
      return { error: null };
    })();
    // 10 秒超时：登录请求若挂起，给用户明确反馈而非永久转圈
    return await withTimeout(task, 10000, {
      error: "登录请求超时，请检查网络或 Supabase 配置",
    });
  } catch (e) {
    return {
      error:
        e instanceof Error
          ? `登录失败：${e.message}`
          : "登录失败，请检查网络或 Supabase 配置",
    };
  }
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

// 取当前登录的管理员（未登录 / 非管理员 / 未配置 / 出错 / 超时 都返回 null）
// 任何异常都吞掉返回 null —— 调用方不能因网络/配置错误而永远卡在 loading
export async function getCurrentAdmin(): Promise<AdminInfo | null> {
  if (!isSupabaseConfigured) return null;
  const task = (async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.email) return null;

      const { data } = await supabase.from("admins").select("email").limit(1);
      if (!data || data.length === 0) return null;
      return { email: session.user.email };
    } catch {
      return null;
    }
  })();
  // 3 秒超时兜底：防止网络挂起导致永久 loading（黑屏）
  return withTimeout(task, 3000, null);
}

// 订阅登录态变化（后台 layout 用来驱动路由保护）
export function subscribeAuth(
  cb: (email: string | null) => void
): () => void {
  if (!isSupabaseConfigured) {
    cb(null);
    return () => {};
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user?.email ?? null);
  });
  return () => data.subscription.unsubscribe();
}

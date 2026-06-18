"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Heart,
  LogOut,
} from "lucide-react";
import { subscribeAuth, signOutAdmin, getCurrentAdmin } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";

const navItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/products", label: "商品价格", icon: Package },
  { href: "/admin/orders", label: "订单", icon: ShoppingBag },
  { href: "/admin/wishes", label: "愿望审核", icon: Heart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  // 兼容有无尾斜杠：trailingSlash:true 下 pathname 可能是 /admin/login 或 /admin/login/
  const isLogin = (pathname ?? "").replace(/\/$/, "") === "/admin/login";

  // ============ 所有 useEffect 必须在任何 return 之前（Hooks 规则）============
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }
    // 必须带 catch：getCurrentAdmin 内部已 try/catch 兜底 null，
    // 但仍防御任何未预期 reject，否则 setReady 永不执行 → 永久 loading（视觉黑屏）
    getCurrentAdmin()
      .then((a) => {
        setEmail(a?.email ?? null);
      })
      .catch(() => {
        /* 静默：未登录或网络异常都视为未登录 */
      })
      .finally(() => setReady(true));
    const unsub = subscribeAuth((e) => setEmail(e));
    return unsub;
  }, []);

  // 未登录 → 跳登录（必须在 effect 里跳转，render 中调 router 会崩溃）
  useEffect(() => {
    if (isSupabaseConfigured && ready && !email && !isLogin) {
      router.replace("/admin/login");
    }
  }, [ready, email, isLogin, router, isSupabaseConfigured]);

  // ============ 以下都是条件 return，必须在所有 Hook 之后 ============

  // 未配置 Supabase 时给提示
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="card-classic max-w-md p-8 text-center">
          <h1 className="mb-3 text-xl font-bold text-gold">未配置 Supabase</h1>
          <p className="mb-4 text-sm text-text-secondary">
            后台需要 Supabase 支撑。请先按项目根目录的{" "}
            <code className="text-gold">SUPABASE_SETUP.md</code> 完成配置，并在
            Cloudflare Pages 环境变量中填入：
          </p>
          <pre className="mb-4 overflow-x-auto rounded-lg bg-bg-input p-3 text-left text-xs text-text-muted">
{`NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY`}
          </pre>
          <Link href="/" className="btn-secondary inline-block text-sm">
            返回前台
          </Link>
        </div>
      </div>
    );
  }

  // 登录页不套外壳、不做跳转保护
  if (isLogin) {
    return <>{children}</>;
  }

  // 等待登录态判定（用大号金色字，避免在暗背景上被误判为黑屏）
  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        <span className="text-base font-bold text-gold">加载中…</span>
      </div>
    );
  }

  // 未登录 → 渲染空（上方 effect 已触发跳转）
  if (!email) {
    return null;
  }

  const handleLogout = async () => {
    await signOutAdmin();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen md:flex">
      {/* 侧边栏（桌面） */}
      <aside className="hidden w-56 flex-shrink-0 border-r border-border bg-bg-card md:block">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl">🏮</span>
            <span className="text-lg font-bold text-gold">兰清堂后台</span>
          </Link>
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gold/10 text-gold"
                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-3 pt-8">
          <div className="mb-3 truncate px-3 text-xs text-text-muted">
            {email}
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>
      </aside>

      {/* 顶部栏（移动端） */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg-primary/95 px-4 py-3 backdrop-blur-md md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl">🏮</span>
          <span className="font-bold text-gold">兰清堂后台</span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-text-muted hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* 移动端横向导航 */}
      <div className="sticky top-[57px] z-30 flex border-b border-border bg-bg-card md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                active ? "text-gold" : "text-text-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

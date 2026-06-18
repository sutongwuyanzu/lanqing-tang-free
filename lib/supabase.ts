import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 是否已配置 Supabase（前台在未配置时降级到本地默认价/本地存储）
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// createClient 是 module 顶层代码，构建期和浏览器期都会执行。
// 任何异常（无效 URL、网络、SDK 内部错）一旦抛出，整个 import 它的 chunk
// 加载失败 → 所有引用页面（admin 全部 + 前台 pricing）整树崩溃 = 黑屏无报错。
// 所以必须用 try/catch 兜底，失败时给一个哑 client，调用方靠 isSupabaseConfigured 守卫。
let supabase: SupabaseClient;
try {
  supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-anon-key",
    {
      auth: { persistSession: true, autoRefreshToken: true },
    }
  );
} catch {
  // 极端情况：createClient 抛错。构造一个永不抛错的哑对象，
  // 所有方法返回空结果，避免上层崩溃。isSupabaseConfigured 此时通常为 false。
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: {}, error: { message: "Supabase 未正确初始化" } as never }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } as never }),
    },
    from: () => ({
      select: () => ({ data: null, error: null, limit: () => ({ data: null, error: null }) }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ eq: () => ({ data: null, error: null }), select: () => ({ data: null, error: null }) }),
      delete: () => ({ eq: () => ({ data: null, error: null }) }),
      order: () => ({ data: null, error: null, range: () => ({ data: null, error: null }) }),
      eq: () => ({ data: null, error: null, order: () => ({ data: null, error: null }) }),
    }),
  } as unknown as SupabaseClient;
}
export { supabase };

// ============ 数据库行类型（对应 supabase/schema.sql） ============

export interface Product {
  id: string;
  product_key: string;
  name: string;
  category: "lot" | "pray" | "naming";
  price: number;
  is_active: boolean;
  sort: number;
  remark: string | null;
  updated_at: string;
}

export interface Order {
  id: number;
  order_no: string;
  type: "lot" | "pray" | "naming";
  product_key: string | null;
  product_name: string | null;
  amount: number;
  customer_name: string | null;
  customer_phone: string | null;
  detail: Record<string, unknown> | null;
  status: "paid" | "pending" | "refunded";
  created_at: string;
}

// 前台写入订单时的载荷（id/status/created_at 由数据库默认生成）
export type OrderInsert = Omit<Order, "id" | "created_at"> & {
  status?: Order["status"];
};

export interface Wish {
  id: number;
  source: "pray" | "lot";
  customer_name: string | null;
  masked_name: string | null;
  lamp: string | null;
  content: string | null;
  status: "pending" | "approved" | "rejected";
  is_public: boolean;
  created_at: string;
}

export type WishInsert = Omit<Wish, "id" | "created_at"> & {
  status?: Wish["status"];
  is_public?: boolean;
};

// 价格服务 —— 前台统一从这里取价
// 走 Supabase products 表，带内存缓存；未配置/请求失败时降级到默认价
import { supabase, isSupabaseConfigured } from "./supabase";

// product_key 常量（与 supabase/schema.sql 一致）
export const PRODUCT_KEYS = {
  LOT_EXTRA: "lot_extra",
  PRAY_MONTH: "pray_month",
  PRAY_HUNDRED: "pray_hundred",
  PRAY_YEAR: "pray_year",
  PRAY_ETERNAL: "pray_eternal",
  NAMING_UNLOCK: "naming_unlock",
} as const;

// 硬编码默认价（Supabase 不可达时降级用，也即上线初期的价格）
export const DEFAULT_PRICES: Record<string, number> = {
  lot_extra: 3.9,
  pray_month: 9.9,
  pray_hundred: 29.9,
  pray_year: 99,
  pray_eternal: 299,
  naming_unlock: 29.9,
};

const TTL = 5 * 60 * 1000; // 5 分钟
const cache = new Map<string, { price: number; expire: number }>();

function setCache(key: string, price: number) {
  cache.set(key, { price, expire: Date.now() + TTL });
}

// 取单个价格
export async function getPrice(key: string): Promise<number> {
  const hit = cache.get(key);
  if (hit && hit.expire > Date.now()) return hit.price;

  if (!isSupabaseConfigured) {
    const def = DEFAULT_PRICES[key] ?? 0;
    setCache(key, def);
    return def;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("price")
      .eq("product_key", key)
      .eq("is_active", true)
      .maybeSingle();
    if (error || !data) throw new Error("no price");
    const price = Number(data.price);
    setCache(key, price);
    return price;
  } catch {
    const def = DEFAULT_PRICES[key] ?? 0;
    setCache(key, def);
    return def;
  }
}

// 批量取价（一次查询，点灯页 4 档一起取）
export async function getPrices(keys: string[]): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  const now = Date.now();
  const missing: string[] = [];
  for (const k of keys) {
    const hit = cache.get(k);
    if (hit && hit.expire > now) result[k] = hit.price;
    else missing.push(k);
  }
  if (missing.length === 0) return result;

  if (!isSupabaseConfigured) {
    for (const k of missing) {
      const def = DEFAULT_PRICES[k] ?? 0;
      result[k] = def;
      setCache(k, def);
    }
    return result;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("product_key, price")
      .in("product_key", missing)
      .eq("is_active", true);
    if (error) throw error;
    const map = new Map((data || []).map((r) => [r.product_key, Number(r.price)]));
    for (const k of missing) {
      const price = map.get(k) ?? DEFAULT_PRICES[k] ?? 0;
      result[k] = price;
      setCache(k, price);
    }
  } catch {
    for (const k of missing) {
      const def = DEFAULT_PRICES[k] ?? 0;
      result[k] = def;
      setCache(k, def);
    }
  }
  return result;
}

// 后台改价后清缓存，让前台下次取新价
export function invalidatePriceCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}

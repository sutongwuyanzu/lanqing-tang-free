"use client";

import { useEffect, useState } from "react";
import { Package, Check, X, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/supabase";
import { invalidatePriceCache } from "@/lib/pricing";

const categoryLabel: Record<string, string> = {
  lot: "灵签",
  pray: "点灯",
  naming: "起名",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort");
      if (error) throw error;
      setProducts((data || []) as Product[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (p: Product) => {
    const raw = editing[p.product_key];
    if (raw === undefined) return;
    const price = parseFloat(raw);
    if (isNaN(price) || price < 0) {
      setError("价格必须是有效的非负数");
      return;
    }
    setSaving(p.product_key);
    setError("");
    try {
      const { error } = await supabase
        .from("products")
        .update({ price, updated_at: new Date().toISOString() })
        .eq("id", p.id);
      if (error) throw error;
      // 清前台缓存，使新价尽快生效
      invalidatePriceCache(p.product_key);
      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, price } : x))
      );
      setEditing((prev) => {
        const next = { ...prev };
        delete next[p.product_key];
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(null);
    }
  };

  const toggleActive = async (p: Product) => {
    const next = !p.is_active;
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: next, updated_at: new Date().toISOString() })
        .eq("id", p.id);
      if (error) throw error;
      invalidatePriceCache(p.product_key);
      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, is_active: next } : x))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失败");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-text-muted">
        加载中…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-text-primary">
            <Package className="h-5 w-5 text-gold" />
            商品价格
          </h1>
          <p className="text-sm text-text-muted">
            改价后前台 5 分钟内自动生效（可清缓存立即生效）
          </p>
        </div>
        <button
          onClick={load}
          className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          刷新
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="card-classic p-8 text-center text-sm text-text-muted">
          暂无商品。请确认已执行 supabase/schema.sql 初始化数据。
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => {
            const val =
              editing[p.product_key] !== undefined
                ? editing[p.product_key]
                : String(p.price);
            const dirty = editing[p.product_key] !== undefined;
            return (
              <div key={p.id} className="card-classic p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded border border-border px-2 py-0.5 text-[10px] text-text-secondary">
                    {categoryLabel[p.category] || p.category}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">{p.name}</div>
                    {p.remark && (
                      <div className="text-xs text-text-muted">{p.remark}</div>
                    )}
                    <div className="mt-0.5 text-[10px] text-text-muted">
                      key: {p.product_key}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-text-muted">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={val}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [p.product_key]: e.target.value,
                        }))
                      }
                      className="input-classic w-24 py-1.5 text-sm"
                    />
                    {dirty && (
                      <button
                        onClick={() => handleSave(p)}
                        disabled={saving === p.product_key}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold hover:bg-gold/20 disabled:opacity-50"
                        title="保存"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {dirty && (
                      <button
                        onClick={() =>
                          setEditing((prev) => {
                            const next = { ...prev };
                            delete next[p.product_key];
                            return next;
                          })
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated"
                        title="取消"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleActive(p)}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                        p.is_active
                          ? "border-green-accent/40 text-green-accent"
                          : "border-border text-text-muted"
                      }`}
                    >
                      {p.is_active ? "上架" : "下架"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

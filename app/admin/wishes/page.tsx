"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Heart,
  RefreshCw,
  Check,
  X,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Wish } from "@/lib/supabase";

const sourceLabel: Record<string, string> = {
  pray: "点灯",
  lot: "灵签",
};

const statusLabel: Record<string, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已驳回",
};

export default function AdminWishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("pending");
  const [actioning, setActioning] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (filter) query = query.eq("status", filter);
      const { data, error } = await query;
      if (error) throw error;
      setWishes((data || []) as Wish[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (
    w: Wish,
    patch: Partial<Pick<Wish, "status" | "is_public">>
  ) => {
    setActioning(w.id);
    try {
      const { error } = await supabase
        .from("wishes")
        .update(patch)
        .eq("id", w.id);
      if (error) throw error;
      setWishes((prev) =>
        prev.map((x) => (x.id === w.id ? { ...x, ...patch } : x))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失败");
    } finally {
      setActioning(null);
    }
  };

  const remove = async (w: Wish) => {
    if (!confirm("确认删除该愿望？此操作不可撤销。")) return;
    setActioning(w.id);
    try {
      const { error } = await supabase.from("wishes").delete().eq("id", w.id);
      if (error) throw error;
      setWishes((prev) => prev.filter((x) => x.id !== w.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "删除失败");
    } finally {
      setActioning(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-text-primary">
            <Heart className="h-5 w-5 text-gold" />
            愿望审核
          </h1>
          <p className="text-sm text-text-muted">
            通过且设为公开的愿望会展示在前台祈愿墙
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

      {/* 筛选 Tab */}
      <div className="flex gap-1.5">
        {[
          { key: "pending", label: "待审核" },
          { key: "approved", label: "已通过" },
          { key: "rejected", label: "已驳回" },
          { key: "", label: "全部" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              filter === t.key
                ? "bg-gold/10 text-gold"
                : "text-text-muted hover:bg-bg-card hover:text-text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-text-muted">加载中…</div>
      ) : wishes.length === 0 ? (
        <div className="card-classic p-12 text-center text-sm text-text-muted">
          暂无愿望
        </div>
      ) : (
        <div className="space-y-2">
          {wishes.map((w) => (
            <div key={w.id} className="card-classic p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-secondary">
                      {sourceLabel[w.source] || w.source}
                    </span>
                    {w.lamp && (
                      <span className="text-[10px] text-gold">{w.lamp}</span>
                    )}
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] ${
                        w.status === "approved"
                          ? "bg-green-accent/15 text-green-accent"
                          : w.status === "rejected"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-gold/15 text-gold"
                      }`}
                    >
                      {statusLabel[w.status] || w.status}
                    </span>
                    {w.is_public && (
                      <span className="flex items-center gap-0.5 text-[10px] text-text-muted">
                        <Eye className="h-3 w-3" /> 公开
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-text-primary">
                    {w.customer_name || "匿名"}
                    {w.masked_name ? `（${w.masked_name}）` : ""}
                  </div>
                  {w.content && (
                    <div className="mt-0.5 text-sm text-text-secondary">
                      “{w.content}”
                    </div>
                  )}
                  <div className="mt-0.5 text-[10px] text-text-muted">
                    {new Date(w.created_at).toLocaleString("zh-CN")}
                  </div>
                </div>
              </div>

              {/* 操作 */}
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-2">
                {w.status !== "approved" && (
                  <button
                    onClick={() =>
                      update(w, { status: "approved", is_public: true })
                    }
                    disabled={actioning === w.id}
                    className="flex items-center gap-1 rounded border border-green-accent/40 px-2 py-1 text-[11px] text-green-accent hover:bg-green-accent/10 disabled:opacity-50"
                  >
                    <Check className="h-3 w-3" />
                    通过并公开
                  </button>
                )}
                {w.status === "approved" && (
                  <button
                    onClick={() => update(w, { is_public: !w.is_public })}
                    disabled={actioning === w.id}
                    className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-text-secondary hover:bg-bg-elevated disabled:opacity-50"
                  >
                    {w.is_public ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        取消公开
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        设为公开
                      </>
                    )}
                  </button>
                )}
                {w.status !== "rejected" && (
                  <button
                    onClick={() => update(w, { status: "rejected" })}
                    disabled={actioning === w.id}
                    className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[11px] text-text-muted hover:bg-bg-elevated disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                    驳回
                  </button>
                )}
                <button
                  onClick={() => remove(w)}
                  disabled={actioning === w.id}
                  className="ml-auto flex items-center gap-1 rounded border border-red-500/30 px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

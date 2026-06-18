"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingBag, RefreshCw, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/supabase";

const typeLabel: Record<string, string> = {
  lot: "灵签",
  pray: "点灯",
  naming: "起名",
};

const statusLabel: Record<string, string> = {
  paid: "已付款",
  pending: "待付款",
  refunded: "已退款",
};

const pageSize = 20;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [actioning, setActioning] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase
        .from("orders")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (filterType) query = query.eq("type", filterType);
      if (filterStatus) query = query.eq("status", filterStatus);
      if (keyword.trim()) {
        query = query.or(
          `customer_name.ilike.%${keyword.trim()}%,order_no.ilike.%${keyword.trim()}%,product_name.ilike.%${keyword.trim()}%`
        );
      }

      const { data, error, count } = await query;
      if (error) throw error;
      setOrders((data || []) as Order[]);
      setTotal(count || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [page, filterType, filterStatus, keyword]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (o: Order, status: Order["status"]) => {
    setActioning(o.id);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", o.id);
      if (error) throw error;
      setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status } : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失败");
    } finally {
      setActioning(null);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-text-primary">
            <ShoppingBag className="h-5 w-5 text-gold" />
            订单管理
          </h1>
          <p className="text-sm text-text-muted">共 {total} 条</p>
        </div>
        <button
          onClick={load}
          className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          刷新
        </button>
      </div>

      {/* 筛选 */}
      <div className="card-classic flex flex-wrap items-center gap-2 p-3">
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(0);
          }}
          className="input-classic w-auto py-1.5 text-sm"
        >
          <option value="">全部类型</option>
          <option value="lot">灵签</option>
          <option value="pray">点灯</option>
          <option value="naming">起名</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(0);
          }}
          className="input-classic w-auto py-1.5 text-sm"
        >
          <option value="">全部状态</option>
          <option value="paid">已付款</option>
          <option value="pending">待付款</option>
          <option value="refunded">已退款</option>
        </select>
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
            placeholder="搜索姓名/单号/商品"
            className="input-classic py-1.5 pl-8 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* 列表 */}
      {loading ? (
        <div className="py-16 text-center text-text-muted">加载中…</div>
      ) : orders.length === 0 ? (
        <div className="card-classic p-12 text-center text-sm text-text-muted">
          暂无订单
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="card-classic p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-secondary">
                      {typeLabel[o.type] || o.type}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {o.product_name || "—"}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] ${
                        o.status === "paid"
                          ? "bg-green-accent/15 text-green-accent"
                          : o.status === "refunded"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-bg-elevated text-text-muted"
                      }`}
                    >
                      {statusLabel[o.status] || o.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-text-muted">
                    {o.customer_name || "匿名"}
                    {o.customer_phone ? ` · ${o.customer_phone}` : ""}
                  </div>
                  <div className="mt-0.5 text-[10px] text-text-muted">
                    单号 {o.order_no} ·{" "}
                    {new Date(o.created_at).toLocaleString("zh-CN")}
                  </div>
                  {o.detail && Object.keys(o.detail).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-text-secondary">
                      {Object.entries(o.detail).map(([k, v]) => (
                        <span
                          key={k}
                          className="rounded bg-bg-elevated px-1.5 py-0.5"
                        >
                          {k}: {String(v)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="text-lg font-bold text-gold">
                    ¥{Number(o.amount).toFixed(2)}
                  </div>
                  {o.status === "paid" && (
                    <button
                      onClick={() => setStatus(o, "refunded")}
                      disabled={actioning === o.id}
                      className="rounded border border-red-500/30 px-2 py-0.5 text-[10px] text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      标记退款
                    </button>
                  )}
                  {o.status === "refunded" && (
                    <button
                      onClick={() => setStatus(o, "paid")}
                      disabled={actioning === o.id}
                      className="rounded border border-border px-2 py-0.5 text-[10px] text-text-muted hover:bg-bg-elevated disabled:opacity-50"
                    >
                      恢复已付
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
          >
            上一页
          </button>
          <span className="text-xs text-text-muted">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}

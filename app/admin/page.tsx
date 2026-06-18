"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Heart,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/supabase";

type Stats = {
  todayCount: number;
  todayRevenue: number;
  totalCount: number;
  totalRevenue: number;
  pendingWishes: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [todayRes, allRes, pendingRes, recentRes] = await Promise.all([
          supabase
            .from("orders")
            .select("amount")
            .gte("created_at", startOfToday.toISOString())
            .eq("status", "paid"),
          supabase.from("orders").select("amount").eq("status", "paid"),
          supabase
            .from("wishes")
            .select("id", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(10),
        ]);

        if (todayRes.error) throw todayRes.error;

        const todayRows = todayRes.data || [];
        const allRows = allRes.data || [];

        setStats({
          todayCount: todayRows.length,
          todayRevenue: todayRows.reduce(
            (s, r) => s + Number(r.amount || 0),
            0
          ),
          totalCount: allRows.length,
          totalRevenue: allRows.reduce(
            (s, r) => s + Number(r.amount || 0),
            0
          ),
          pendingWishes: pendingRes.count || 0,
        });
        setRecent((recentRes.data || []) as Order[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-text-muted">
        加载中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-classic p-6 text-center text-sm text-red-400">
        {error}
        <p className="mt-2 text-xs text-text-muted">
          请确认已按 SUPABASE_SETUP.md 建表，且当前账号在 admins 白名单内。
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: "今日订单",
      value: stats?.todayCount ?? 0,
      icon: ShoppingBag,
      color: "text-blue-400",
    },
    {
      label: "今日营收",
      value: `¥${(stats?.todayRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-gold",
    },
    {
      label: "累计订单",
      value: stats?.totalCount ?? 0,
      icon: TrendingUp,
      color: "text-green-accent",
    },
    {
      label: "累计营收",
      value: `¥${(stats?.totalRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-gold",
    },
    {
      label: "待审愿望",
      value: stats?.pendingWishes ?? 0,
      icon: Heart,
      color: "text-red-accent",
      href: "/admin/wishes",
    },
  ];

  const typeLabel: Record<string, string> = {
    lot: "灵签",
    pray: "点灯",
    naming: "起名",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">仪表盘</h1>
        <p className="text-sm text-text-muted">经营数据概览</p>
      </div>

      {/* 数据卡片 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => {
          const Icon = c.icon;
          const inner = (
            <div className="card-classic p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-text-muted">{c.label}</span>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </div>
              <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
            </div>
          );
          return c.href ? (
            <Link key={c.label} href={c.href}>
              {inner}
            </Link>
          ) : (
            <div key={c.label}>{inner}</div>
          );
        })}
      </div>

      {/* 近期订单 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gold">
            <Clock className="h-4 w-4" />
            最近订单
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs text-text-muted hover:text-gold"
          >
            查看全部 →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="card-classic p-8 text-center text-sm text-text-muted">
            暂无订单
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((o) => (
              <div
                key={o.id}
                className="card-classic flex items-center justify-between p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-secondary">
                      {typeLabel[o.type] || o.type}
                    </span>
                    <span className="truncate text-sm text-text-primary">
                      {o.product_name || "—"}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-text-muted">
                    {o.customer_name || "匿名"} ·{" "}
                    {new Date(o.created_at).toLocaleString("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="ml-3 text-right">
                  <div className="font-bold text-gold">¥{Number(o.amount).toFixed(2)}</div>
                  <div className="text-[10px] text-text-muted">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

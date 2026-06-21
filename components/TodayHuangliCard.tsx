"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, Sparkles } from "lucide-react";
import { getHuangli, getLuckLevelColor, type HuangliInfo } from "@/lib/huangli-data";

export function TodayHuangliCard() {
  const [info, setInfo] = useState<HuangliInfo | null>(null);

  useEffect(() => {
    setInfo(getHuangli(new Date()));
  }, []);

  if (!info) {
    return (
      <Link href="/huangli" className="block">
        <div className="card-classic relative overflow-hidden p-5">
          <CalendarDays className="mx-auto h-8 w-8 animate-pulse text-gold-dim" />
          <p className="mt-2 text-center text-xs text-text-muted">正在推算今日黄历…</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/huangli" className="block group">
      <div className="card-classic relative overflow-hidden p-5">
        {/* 背景光晕 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/5 blur-2xl" />
        </div>

        <div className="relative">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10">
                <CalendarDays className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">今日黄历</h3>
                <p className="text-[10px] text-text-muted">{info.solarDate}</p>
              </div>
            </div>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getLuckLevelColor(info.luckLevel)}`}
            >
              {info.luckLevel}
            </span>
          </div>

          {/* 干支摘要 */}
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded bg-bg-input px-2 py-0.5 text-text-secondary">
              {info.dayPillar}日
            </span>
            <span className="rounded bg-bg-input px-2 py-0.5 text-text-secondary">
              建{info.jianChu}
            </span>
            <span className="rounded bg-bg-input px-2 py-0.5 text-text-secondary">
              {info.shengXiao}年
            </span>
            <span className="rounded bg-bg-input px-2 py-0.5 text-text-secondary">
              {info.xiu}宿
            </span>
          </div>

          {/* 宜忌摘要 */}
          <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-2">
              <p className="text-[10px] text-green-400">宜</p>
              <p className="mt-0.5 truncate text-green-300">
                {info.yi.slice(0, 3).map((i) => i.text).join(" · ")}
              </p>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2">
              <p className="text-[10px] text-red-400">忌</p>
              <p className="mt-0.5 truncate text-red-300">
                {info.ji.slice(0, 3).map((i) => i.text).join(" · ")}
              </p>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-gold-dim">
              <Sparkles className="h-3 w-3" />
              财神 {info.caiShen} · 生门 {info.qimenDirection}
            </span>
            <span className="flex items-center gap-0.5 text-gold opacity-0 transition-opacity group-hover:opacity-100">
              查看 <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

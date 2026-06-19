"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollText, Flame, Sparkles, ChevronRight, Share2, Inbox } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

// 本地存储的历史记录类型（与各功能页写入结构一致）
interface LotRecord {
  id: string;
  level: string;
  title: string;
  wish: string;
  time: string;
}
interface LampRecord {
  orderId: number;
  name: string;
  relationship?: string;
  lamp: string;
  duration: string;
  wish: string;
  time: string;
}
interface WishItem {
  id: number;
  name: string;
  maskedName: string;
  lamp: string;
  wish: string;
  time: string;
}

export default function ProfilePage() {
  const [lots, setLots] = useState<LotRecord[]>([]);
  const [lamps, setLamps] = useState<LampRecord[]>([]);
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setLots(JSON.parse(localStorage.getItem("lqt_history") || "[]"));
      setLamps(JSON.parse(localStorage.getItem("lqt_lamps_history") || "[]"));
      setWishes(JSON.parse(localStorage.getItem("lqt_wall_wishes") || "[]"));
    } catch {
      // 本地数据损坏时静默降级为空
    }
    setLoaded(true);
  }, []);

  const totalCount = lots.length + lamps.length + wishes.length;
  const isEmpty = loaded && totalCount === 0;

  return (
    <div className="page-container">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gold">我的记录</h1>
        <p className="text-sm text-text-secondary">善念留痕，心迹可循</p>
      </div>

      {/* 累计统计卡 */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-bg-card p-4 text-center">
          <ScrollText className="mx-auto mb-2 h-6 w-6 text-gold" />
          <div className="text-2xl font-bold text-gold">{loaded ? lots.length : "—"}</div>
          <div className="mt-0.5 text-xs text-text-muted">求签</div>
        </div>
        <div className="rounded-2xl border border-border bg-bg-card p-4 text-center">
          <Flame className="mx-auto mb-2 h-6 w-6 text-gold" />
          <div className="text-2xl font-bold text-gold">{loaded ? lamps.length : "—"}</div>
          <div className="mt-0.5 text-xs text-text-muted">点灯</div>
        </div>
        <div className="rounded-2xl border border-border bg-bg-card p-4 text-center">
          <Sparkles className="mx-auto mb-2 h-6 w-6 text-gold" />
          <div className="text-2xl font-bold text-gold">{loaded ? wishes.length : "—"}</div>
          <div className="mt-0.5 text-xs text-text-muted">祈愿</div>
        </div>
      </div>

      {/* 空状态 */}
      {isEmpty && (
        <div className="mb-8 rounded-2xl border border-dashed border-border bg-bg-card/50 p-10 text-center">
          <Inbox className="mx-auto mb-3 h-12 w-12 text-text-muted" />
          <p className="mb-1 text-lg font-medium text-text-primary">暂无记录</p>
          <p className="mb-6 text-sm text-text-muted">心诚则灵，从一次祈愿开始</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/lingqian" className="btn-primary">求一签</Link>
            <Link href="/pray" className="btn-secondary">点灯祈福</Link>
            <Link href="/dream" className="btn-secondary">解梦</Link>
          </div>
        </div>
      )}

      {/* 灵签记录 */}
      {lots.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gold">
              <ScrollText className="h-5 w-5" /> 灵签记录
            </h2>
            <Link href="/lingqian" className="flex items-center gap-0.5 text-sm text-text-muted hover:text-gold">
              去求签 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {lots.slice(0, 5).map((lot, i) => (
              <div key={i} className="rounded-xl border border-border bg-bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">{lot.title}</span>
                  <span className="text-xs text-gold">{lot.level}</span>
                </div>
                <p className="mt-1 truncate text-sm text-text-secondary">{lot.wish}</p>
                <p className="mt-1 text-xs text-text-muted">{lot.time}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 点灯记录 */}
      {lamps.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gold">
              <Flame className="h-5 w-5" /> 点灯记录
            </h2>
            <Link href="/pray" className="flex items-center gap-0.5 text-sm text-text-muted hover:text-gold">
              去点灯 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {lamps.slice(0, 5).map((lamp, i) => (
              <div key={i} className="rounded-xl border border-border bg-bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">{lamp.lamp}</span>
                  <span className="text-xs text-gold">{lamp.duration}</span>
                </div>
                <p className="mt-1 truncate text-sm text-text-secondary">
                  为{lamp.name}祈愿：{lamp.wish || "愿心愿成就"}
                </p>
                <p className="mt-1 text-xs text-text-muted">{lamp.time}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 祈愿记录 */}
      {wishes.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gold">
              <Sparkles className="h-5 w-5" /> 祈愿记录
            </h2>
            <Link href="/pray" className="flex items-center gap-0.5 text-sm text-text-muted hover:text-gold">
              去祈福 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {wishes.slice(0, 5).map((wish, i) => (
              <div key={i} className="rounded-xl border border-border bg-bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">{wish.maskedName} · {wish.lamp}</span>
                </div>
                <p className="mt-1 truncate text-sm text-text-secondary">{wish.wish}</p>
                <p className="mt-1 text-xs text-text-muted">{wish.time}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 分享 */}
      {loaded && !isEmpty && (
        <div className="mb-8 text-center">
          <ShareButton label="分享兰清堂" />
        </div>
      )}

      {/* 功能菜单 */}
      <section className="rounded-2xl border border-border bg-bg-card p-2">
        <Link href="/lingqian" className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-bg-primary">
          <span className="flex items-center gap-2 text-text-primary"><ScrollText className="h-5 w-5 text-gold" /> 关帝灵签</span>
          <ChevronRight className="h-4 w-4 text-text-muted" />
        </Link>
        <Link href="/dream" className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-bg-primary">
          <span className="flex items-center gap-2 text-text-primary"><Sparkles className="h-5 w-5 text-gold" /> 周公解梦</span>
          <ChevronRight className="h-4 w-4 text-text-muted" />
        </Link>
        <Link href="/pray" className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-bg-primary">
          <span className="flex items-center gap-2 text-text-primary"><Flame className="h-5 w-5 text-gold" /> 祈福点灯</span>
          <ChevronRight className="h-4 w-4 text-text-muted" />
        </Link>
      </section>
    </div>
  );
}

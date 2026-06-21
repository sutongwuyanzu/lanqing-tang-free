"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Sun,
  Moon,
  Compass,
  Sparkles,
  ScrollText,
  MoonStar,
  Star,
  Clock,
  AlertTriangle,
  Check,
  X,
  BookOpen,
  Wind,
  Flame,
  Baby,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getHuangli,
  getFutureDays,
  getLuckLevelColor,
  getHourLuckColor,
  type HuangliInfo,
  type FutureDay,
} from "@/lib/huangli-data";
import { ShareButton } from "@/components/ShareButton";

function LuckBadge({ level }: { level: HuangliInfo["luckLevel"] }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-sm font-medium ${getLuckLevelColor(level)}`}
    >
      {level}
    </span>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-input p-3 text-center">
      <p className="text-[11px] text-text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-gold">{value}</p>
    </div>
  );
}

export default function HuangliPage() {
  // 日期在客户端挂载后计算，避免服务端/客户端时区差异引起 hydration 不一致
  const [info, setInfo] = useState<HuangliInfo | null>(null);
  const [future, setFuture] = useState<FutureDay[]>([]);
  const [showAllHours, setShowAllHours] = useState(false);

  useEffect(() => {
    const now = new Date();
    setInfo(getHuangli(now));
    setFuture(getFutureDays(now, 6));
  }, []);

  if (!info) {
    return (
      <div className="page-container">
        <div className="card-classic p-10 text-center">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 animate-pulse text-gold" />
          <p className="text-sm text-text-secondary">正在推算今日黄历…</p>
        </div>
      </div>
    );
  }

  const visibleHours = showAllHours ? info.hours : info.hours.slice(0, 6);

  return (
    <div className="page-container">
      {/* 标题 */}
      <div className="mb-6 text-center">
        <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gold" />
        <h1 className="mb-2 text-3xl font-bold text-gold">今日黄历</h1>
        <p className="text-sm text-text-secondary">
          融通八字 · 紫微 · 奇门 · 灵签 · 解梦
        </p>
      </div>

      {/* 顶部日期卡 */}
      <div className="card-classic relative mb-4 overflow-hidden p-6 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl" />
        </div>
        <div className="relative">
          <div className="mb-3 flex items-center justify-center gap-2 text-text-muted">
            <Sun className="h-4 w-4" />
            <span className="text-sm">{info.solarDate}</span>
            <span className="text-xs">·</span>
            <span className="text-sm">{info.weekDay}</span>
          </div>
          <p className="mb-4 flex items-center justify-center gap-2 text-text-secondary">
            <Moon className="h-4 w-4" />
            <span className="text-sm">{info.lunarDate}</span>
          </p>
          <div className="mb-4 flex items-center justify-center gap-2">
            <LuckBadge level={info.luckLevel} />
          </div>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-text-secondary">
            {info.summary}
          </p>
        </div>
      </div>

      {/* 四柱与生肖 */}
      <div className="card-classic mb-4 p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
          <Star className="h-4 w-4" />四柱干支
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <InfoCell label="年柱" value={info.yearPillar} />
          <InfoCell label="月柱" value={info.monthPillar} />
          <InfoCell label="日柱" value={info.dayPillar} />
          <InfoCell label="生肖" value={info.shengXiao} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <InfoCell label="日干五行" value={info.wuXingDay} />
          <InfoCell label="建除" value={info.jianChu} />
          <InfoCell label="二十八宿" value={info.xiu} />
        </div>
      </div>

      {/* 宜 / 忌 */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card-classic border-red-900/30 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-green-400">
            <Check className="h-4 w-4" />今日宜
          </h2>
          <div className="flex flex-wrap gap-2">
            {info.yi.map((item, i) =>
              item.link ? (
                <Link
                  key={i}
                  href={item.link}
                  className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-300 transition-colors hover:bg-green-500/20"
                >
                  {item.text} →
                </Link>
              ) : (
                <span
                  key={i}
                  className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-300"
                >
                  {item.text}
                </span>
              )
            )}
          </div>
        </div>
        <div className="card-classic border-red-900/30 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-400">
            <X className="h-4 w-4" />今日忌
          </h2>
          <div className="flex flex-wrap gap-2">
            {info.ji.map((item, i) => (
              <span
                key={i}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300"
              >
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 冲煞与方位 */}
      <div className="card-classic mb-4 p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
          <Compass className="h-4 w-4" />冲煞与方位
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <InfoCell label="冲" value={`冲${info.chong}`} />
          <InfoCell label="煞" value={info.sha} />
          <InfoCell label="财神" value={info.caiShen} />
          <InfoCell label="喜神" value={info.xiShen} />
          <InfoCell label="福神" value={info.fuShen} />
          <InfoCell label="胎神" value={info.taiShen} />
        </div>
      </div>

      {/* 吉神 / 凶神 */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card-classic p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
            <Sparkles className="h-4 w-4" />吉神宜趋
          </h2>
          <div className="flex flex-wrap gap-2">
            {info.jiShen.map((s, i) => (
              <span
                key={i}
                className="rounded border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs text-gold"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="card-classic p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-400">
            <AlertTriangle className="h-4 w-4" />凶神宜避
          </h2>
          <div className="flex flex-wrap gap-2">
            {info.xiongShen.map((s, i) => (
              <span
                key={i}
                className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs text-red-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 彭祖百忌 */}
      <div className="card-classic mb-4 p-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-gold">
          <BookOpen className="h-4 w-4" />彭祖百忌
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary">{info.pengZu}</p>
      </div>

      {/* 十二时辰吉凶 */}
      <div className="card-classic mb-4 p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
          <Clock className="h-4 w-4" />十二时辰吉凶
        </h2>
        <div className="space-y-2">
          {visibleHours.map((h) => (
            <div
              key={h.name}
              className="flex items-center justify-between rounded-lg border border-border bg-bg-input p-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated text-sm font-bold text-gold">
                  {h.zhi}
                </span>
                <div>
                  <p className="text-xs font-medium text-text-primary">{h.name}</p>
                  <p className="text-[10px] text-text-muted">{h.range}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block rounded border px-2 py-0.5 text-[10px] ${getHourLuckColor(h.luck)}`}
                >
                  {h.luck}
                </span>
                <p className="mt-1 text-[10px] text-text-muted">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAllHours(!showAllHours)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs text-text-secondary transition-colors hover:border-gold/30 hover:text-gold"
        >
          {showAllHours ? (
            <>
              收起 <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              展开全部十二时辰 <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      </div>

      {/* 近六日运势（两排各三个） */}
      <div className="card-classic mb-4 p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
          <CalendarDays className="h-4 w-4" />近六日运势
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          {future.map((day) => (
            <div
              key={day.offset}
              className={`flex flex-col rounded-lg border p-3 ${
                day.offset === 0
                  ? "border-gold/50 bg-gold/10"
                  : "border-border bg-bg-input"
              }`}
            >
              {/* 日期 + 星期 */}
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-primary">{day.solarShort}</p>
                  <p className="text-[10px] text-text-muted">{day.weekDay}</p>
                </div>
                {day.offset === 0 && (
                  <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[9px] text-gold">今日</span>
                )}
              </div>
              {/* 干支建除 */}
              <p className="mb-2 text-[11px] text-gold">{day.dayPillar} · {day.jianChu}</p>
              {/* 宜忌 */}
              <p className="truncate text-[10px] text-green-300">
                宜 {day.yiShort}
              </p>
              <p className="truncate text-[10px] text-red-300">
                忌 {day.jiShort}
              </p>
              {/* 吉凶等级 */}
              <span
                className={`mt-2 self-start rounded-full border px-2 py-0.5 text-[10px] font-medium ${getLuckLevelColor(day.luckLevel)}`}
              >
                {day.luckLevel}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] text-text-muted">
          等级：上上 · 上吉 · 中上 · 中平 · 中下
        </p>
      </div>

      {/* 综合玄学：紫微流日 + 奇门方位 */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card-classic p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
            <Star className="h-4 w-4" />紫微流日
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">{info.ziweiHint}</p>
        </div>
        <div className="card-classic p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
            <Wind className="h-4 w-4" />奇门生门
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            今日生门居 <span className="font-bold text-gold">{info.qimenDirection}</span>
            ，宜向此方出行、洽谈、谋事，多逢助力。
          </p>
        </div>
      </div>

      {/* 今日宜梦 / 忌梦（解梦联动） */}
      <div className="card-classic mb-4 p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
          <MoonStar className="h-4 w-4" />梦境征兆
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dream"
            className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 transition-colors hover:bg-green-500/20"
          >
            <p className="text-[11px] text-green-400">宜梦 · 吉兆</p>
            <p className="mt-1 text-sm font-bold text-green-300">{info.dreamHint.yi}</p>
            <p className="mt-1 text-[10px] text-text-muted">点击解梦 →</p>
          </Link>
          <Link
            href="/dream"
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 transition-colors hover:bg-red-500/20"
          >
            <p className="text-[11px] text-red-400">忌梦 · 需防</p>
            <p className="mt-1 text-sm font-bold text-red-300">{info.dreamHint.ji}</p>
            <p className="mt-1 text-[10px] text-text-muted">点击化解 →</p>
          </Link>
        </div>
      </div>

      {/* 今日推荐灵签 */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
          <ScrollText className="h-4 w-4" />今日灵签 · 第{info.recommendedLot.id}签
        </h2>
        <p className="mb-1 text-xs text-text-muted">
          {info.recommendedLot.level} · {info.recommendedLot.title}
        </p>
        <p className="mb-3 whitespace-pre-line text-sm leading-relaxed text-text-primary">
          {info.recommendedLot.poem}
        </p>
        <p className="mb-4 text-xs leading-relaxed text-text-secondary">
          {info.recommendedLot.explanation}
        </p>
        <Link
          href="/lingqian"
          className="btn-secondary flex items-center justify-center gap-2 text-sm"
        >
          <Flame className="h-4 w-4" />前往求签
        </Link>
      </div>

      {/* 功能联动入口 */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Link
          href="/pray"
          className="card-classic flex flex-col items-center gap-1 p-4 text-center"
        >
          <Flame className="h-5 w-5 text-gold" />
          <span className="text-xs text-text-secondary">祈福</span>
        </Link>
        <Link
          href="/bazi"
          className="card-classic flex flex-col items-center gap-1 p-4 text-center"
        >
          <Baby className="h-5 w-5 text-gold" />
          <span className="text-xs text-text-secondary">起名</span>
        </Link>
        <Link
          href="/dream"
          className="card-classic flex flex-col items-center gap-1 p-4 text-center"
        >
          <MoonStar className="h-5 w-5 text-gold" />
          <span className="text-xs text-text-secondary">解梦</span>
        </Link>
      </div>

      {/* 分享福报 */}
      <div className="mt-6 flex justify-center">
        <ShareButton label="分享今日黄历，得福报" />
      </div>

      {/* 底部说明 */}
      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">
          黄历推算为简化算法，仅供娱乐参考，不可迷信
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  ScrollText,
  MoonStar,
  Baby,
  Flame,
  CalendarDays,
  Sparkles,
  ArrowDown,
} from "lucide-react";
import { DonateSection } from "@/components/DonateSection";

const features = [
  {
    href: "/pray",
    icon: Flame,
    title: "为家人祈福",
    desc: "点一盏灯，挂家人姓名",
    tag: "镇宅祈福",
    color: "from-red-900/40 to-orange-900/30",
  },
  {
    href: "/lingqian",
    icon: ScrollText,
    title: "关帝灵签",
    desc: "心诚则灵，一签一事",
    tag: "传统签谱",
    color: "from-amber-900/40 to-yellow-900/30",
  },
  {
    href: "/dream",
    icon: MoonStar,
    title: "周公解梦",
    desc: "百梦皆有意，古今相参证",
    tag: "新增",
    color: "from-indigo-900/40 to-purple-900/30",
  },
  {
    href: "/bazi",
    icon: Baby,
    title: "宝宝起名",
    desc: "古籍雅名，福泽一生",
    tag: "八字精批",
    color: "from-emerald-900/40 to-teal-900/30",
  },
  {
    href: "/ziwei",
    icon: Sparkles,
    title: "紫微排盘",
    desc: "紫微斗数，命盘解读",
    tag: "命理",
    color: "from-purple-900/40 to-violet-900/30",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 text-center md:px-6 md:pt-20">
        {/* 背景装饰 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-48 w-48 translate-y-1/2 rounded-full bg-gold/3 blur-2xl" />
        </div>

        {/* 装饰线 */}
        <div className="divider-ornament mb-6 max-w-xs mx-auto text-sm">
          ✦ 以古籍为根，以诚心为引 ✦
        </div>

        {/* 主标题 */}
        <h1 className="mb-4 text-5xl font-bold tracking-tighter leading-tight md:text-6xl lg:text-7xl">
          <span className="text-gold">兰清堂</span>
        </h1>

        <p className="mx-auto mb-8 max-w-md text-lg text-text-secondary md:text-xl">
          为家人祈福 · 求灵签 · 看八字
        </p>

        {/* CTA 按钮 */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/lingqian"
            className="btn-primary flex items-center gap-2 text-lg"
          >
            <ScrollText className="h-5 w-5" />
            立即求签
          </Link>
          <Link href="/pray" className="btn-secondary flex items-center gap-2">
            <Flame className="h-5 w-5" />
            为家人祈福
          </Link>
        </div>

        {/* 向下滚动提示 */}
        <div className="mt-12 flex flex-col items-center gap-1 text-text-muted animate-gentle-sway">
          <span className="text-xs">向下滚动</span>
          <ArrowDown className="h-4 w-4" />
        </div>
      </section>

      {/* 功能入口 */}
      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <div className="divider-ornament mb-8 text-sm">
          ✦ 四大善门 ✦
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href} className="group">
                <div
                  className={`card-classic relative overflow-hidden p-5 md:p-6 ${feature.color}`}
                >
                  {/* 标签 */}
                  {feature.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-medium text-gold">
                      {feature.tag}
                    </span>
                  )}

                  {/* 图标 */}
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>

                  {/* 标题和描述 */}
                  <h3 className="mb-1 text-base font-bold text-text-primary md:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-text-secondary md:text-sm">
                    {feature.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 今日一言 */}
      <section className="mx-auto max-w-4xl px-4 pb-12 md:px-6">
        <div className="card-classic p-6 text-center md:p-8">
          <CalendarDays className="mx-auto mb-3 h-8 w-8 text-gold-dim" />
          <p className="text-sm text-text-secondary">今日一言</p>
          <p className="mt-2 text-lg text-text-primary leading-relaxed">
            &ldquo;心静即声淡，其间无古今。&rdquo;
          </p>
          <p className="mt-1 text-xs text-text-muted">— 白居易</p>
        </div>
      </section>

      {/* 随喜打赏区 */}
      <section className="mx-auto max-w-4xl px-4 md:px-6">
        <DonateSection variant="full" />
      </section>

      {/* 底部说明 */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-text-muted">
          兰清堂 · 心诚则灵
        </p>
        <p className="mt-1 text-[10px] text-text-muted/60">
          仅供娱乐参考，不可迷信
        </p>
      </footer>
    </div>
  );
}

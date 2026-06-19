"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { STAR_DESCRIPTIONS } from "@/lib/ziwei/constants";

const STAR_NAMES = Object.keys(STAR_DESCRIPTIONS);

const STAR_EMOJI: Record<string, string> = {
  '紫微': '👑', '天机': '🧠', '太阳': '☀️', '武曲': '💰',
  '天同': '🕊️', '廉贞': '🎭', '天府': '🏛️', '太阴': '🌙',
  '贪狼': '🐺', '巨门': '🗣️', '天相': '📜', '天梁': '🛡️',
  '七杀': '⚔️', '破军': '🌊',
};

export default function KnowledgePage() {
  return (
    <div className="page-container">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
            <Sparkles className="h-7 w-7 text-gold" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gold">十四主星</h1>
        <p className="text-sm text-text-secondary">紫微斗数核心星曜速览</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {STAR_NAMES.map(name => {
          const desc = STAR_DESCRIPTIONS[name];
          if (!desc) return null;
          return (
            <Link
              key={name}
              href={`/ziwei/`}
              className="card-classic p-4 text-center group"
            >
              <div className="mb-2 text-2xl">{STAR_EMOJI[name] || '⭐'}</div>
              <h2 className="text-base font-bold text-text-primary group-hover:text-gold transition-colors">
                {name}
              </h2>
              <div className="mt-1 text-[10px] text-text-muted">{desc.element} · {desc.nature}</div>
              <div className="mt-2 text-xs text-text-secondary leading-relaxed">
                {desc.keywords}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link href="/ziwei/" className="btn-primary">
          立即排盘
        </Link>
      </div>
    </div>
  );
}

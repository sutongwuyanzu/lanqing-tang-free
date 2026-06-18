"use client";

import { useState } from "react";
import { matchDream, getDefaultDream, DreamEntry } from "@/lib/dream-data";
import { MoonStar, BookOpen, Brain, Clock, Lightbulb, Send, Tag, Flame, TrendingUp } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

function getLuckColor(luck: string): string {
  switch (luck) {
    case "上上": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "上吉": case "上签": return "bg-gold/20 text-gold border-gold/30";
    case "中吉": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "中平": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    case "中下": case "下签": return "bg-gray-700/20 text-gray-400 border-gray-600/30";
    case "大吉": case "吉": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "平": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "小凶": case "凶": return "bg-gray-700/20 text-gray-400 border-gray-600/30";
    default: return "bg-gold/20 text-gold border-gold/30";
  }
}

// 热门梦境（按搜索热度排序，吉凶标签：上上/上吉/上签/中吉/中平/中下/下签）
const popularDreams = [
  { keyword: "梦见蛇", luck: "上吉", desc: "主财运、智慧" },
  { keyword: "梦见飞翔", luck: "上上", desc: "事业突破" },
  { keyword: "梦见水", luck: "中吉", desc: "财运波动" },
  { keyword: "梦见掉牙", luck: "中平", desc: "关注家人健康" },
  { keyword: "梦见死去的亲人", luck: "上吉", desc: "旧去新来" },
  { keyword: "梦见怀孕", luck: "上上", desc: "新事将至" },
  { keyword: "梦见结婚", luck: "上上", desc: "感情美满" },
  { keyword: "梦见考试", luck: "中平", desc: "面临考验" },
  { keyword: "梦见钱", luck: "上上", desc: "财运亨通" },
  { keyword: "梦见火", luck: "中吉", desc: "事业兴旺" },
  { keyword: "梦见鱼", luck: "上吉", desc: "年年有余" },
  { keyword: "梦见鬼", luck: "中下", desc: "心神不宁" },
];

export default function DreamPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<DreamEntry | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const interpret = () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const matched = matchDream(input);
      setResult(matched || getDefaultDream(input));
      setIsAnalyzing(false);
    }, 1200);
  };

  const quickSearch = (keyword: string) => {
    setInput(keyword);
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const matched = matchDream(keyword);
      setResult(matched || getDefaultDream(keyword));
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="page-container">
      <div className="mb-6 text-center">
        <MoonStar className="mx-auto mb-3 h-10 w-10 text-gold" />
        <h1 className="mb-2 text-3xl font-bold text-gold">周公解梦</h1>
        <p className="text-sm text-text-secondary">百梦皆有意，古今相参证</p>
      </div>

      {/* 热门梦境 */}
      <div className="card-classic mb-4 p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold">
          <TrendingUp className="h-4 w-4" />热门梦境
        </h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {popularDreams.map((dream) => (
            <button
              key={dream.keyword}
              onClick={() => quickSearch(dream.keyword)}
              className="flex items-center justify-between rounded-lg border border-border bg-bg-input p-2.5 text-left transition-colors hover:border-gold/30"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-text-primary">{dream.keyword}</div>
                <div className="truncate text-[10px] text-text-muted">{dream.desc}</div>
              </div>
              <span className={`ml-2 flex-shrink-0 rounded border px-1.5 py-0.5 text-[9px] ${getLuckColor(dream.luck)}`}>{dream.luck}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="card-classic mb-4 p-5">
        <label className="mb-2 block text-sm font-medium text-text-primary">请描述您的梦境</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder="例如：梦见被蛇咬、梦见飞翔..." className="input-classic mb-3 resize-none" />
        <button onClick={interpret} disabled={!input.trim() || isAnalyzing} className="btn-primary flex w-full items-center justify-center gap-2">
          {isAnalyzing ? (<><MoonStar className="h-5 w-5 animate-spin" />师父解梦中...</>) : (<><Send className="h-5 w-5" />请师父解梦</>)}
        </button>
      </div>

      {/* 解析结果 */}
      {result && (
        <div className="animate-fade-in-up space-y-4">
          <div className="card-classic p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted">所解梦境</p>
                <h2 className="text-xl font-bold text-gold">{result.title}</h2>
              </div>
              <span className={`rounded-full border px-3 py-1 text-sm font-medium ${getLuckColor(result.luck)}`}>{result.luck}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary"><Tag className="h-3 w-3" />{result.aspect}</div>
          </div>
          <div className="card-classic p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold"><BookOpen className="h-4 w-4" />周公解梦</h3>
            <p className="leading-relaxed text-text-secondary">{result.zhougong}</p>
          </div>
          <div className="card-classic p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold"><Brain className="h-4 w-4" />弗洛伊德解读</h3>
            <p className="leading-relaxed text-text-secondary">{result.freud}</p>
          </div>
          <div className="card-classic p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold"><Clock className="h-4 w-4" />应事时机</h3>
            <p className="leading-relaxed text-text-secondary">{result.timing}</p>
          </div>
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold"><Lightbulb className="h-4 w-4" />化解与建议</h3>
            <p className="leading-relaxed text-text-primary">{result.solution}</p>
          </div>

          {/* 分享福报 */}
          <div className="flex justify-center">
            <ShareButton label="分享此解梦，得福报" />
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">共收录 20+ 经典梦境 · 仅供娱乐参考</p>
      </div>
    </div>
  );
}

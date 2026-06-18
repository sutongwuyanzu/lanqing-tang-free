"use client";

import { useState, useEffect, useCallback } from "react";
import { allLots, Lot } from "@/lib/lots-data";
import { Sparkles, ChevronDown, Trash2, History } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { DonateSection } from "@/components/DonateSection";

interface LotRecord {
  id: number;
  level: string;
  title: string;
  wish: string;
  time: string;
}

function getLevelColor(level: string): string {
  if (level.includes("大吉") || level.includes("上上")) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (level.includes("上") || level.includes("吉")) return "bg-gold/20 text-gold border-gold/30";
  if (level.includes("中")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (level.includes("末")) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export default function LingqianPage() {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<Lot | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [wish, setWish] = useState("");
  const [history, setHistory] = useState<LotRecord[]>([]);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("lqt_history") || "[]");
    setHistory(h);
  }, []);

  // 免费版：不限次数，直接抽
  const doDraw = useCallback(() => {
    setIsShaking(true);
    setResult(null);
    setIsRevealed(false);
    setTimeout(() => {
      const lot = allLots[Math.floor(Math.random() * allLots.length)];
      setResult(lot);
      setIsShaking(false);
      const record: LotRecord = {
        id: lot.id,
        level: lot.level,
        title: lot.title,
        wish: wish || "（未填写）",
        time: new Date().toLocaleString("zh-CN"),
      };
      const newHistory = [record, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem("lqt_history", JSON.stringify(newHistory));
    }, 1500);
  }, [wish, history]);

  const deleteRecord = (idx: number) => {
    const newHistory = history.filter((_, i) => i !== idx);
    setHistory(newHistory);
    localStorage.setItem("lqt_history", JSON.stringify(newHistory));
  };

  return (
    <div className="page-container">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gold">关帝灵签</h1>
        <p className="text-sm text-text-secondary">心诚则灵，一签一事</p>
      </div>

      <div className="card-classic mb-4 p-5">
        <label className="mb-2 block text-sm font-medium text-gold">✍️ 写下心愿，心诚则灵</label>
        <textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          rows={2}
          placeholder="例如：愿事业顺利、家人平安..."
          className="input-classic resize-none"
        />
      </div>

      <div className="card-classic mb-4 overflow-hidden p-6">
        <div className="flex flex-col items-center">
          <div className={`mb-4 transition-transform ${isShaking ? "animate-shake" : ""}`}>
            <div className="relative flex h-40 w-20 flex-col items-center">
              <div className="absolute bottom-0 left-1/2 h-32 w-16 -translate-x-1/2 rounded-b-2xl bg-gradient-to-b from-amber-800 to-amber-950 border border-amber-700/50" />
              <div className="absolute left-1/2 top-0 h-4 w-20 -translate-x-1/2 rounded-t-lg bg-amber-800 border border-amber-600/50" />
              {!result && (
                <>
                  <div className="absolute left-[38%] top-2 h-24 w-1.5 -translate-x-1/2 rounded-t bg-yellow-200/80" />
                  <div className="absolute left-[48%] top-1 h-28 w-1.5 -translate-x-1/2 rounded-t bg-yellow-100/80" />
                  <div className="absolute left-[58%] top-3 h-22 w-1.5 -translate-x-1/2 rounded-t bg-yellow-200/60" />
                </>
              )}
            </div>
          </div>

          <div className="mb-4">
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
              🎁 免费不限次数
            </span>
          </div>

          <button
            onClick={doDraw}
            disabled={isShaking}
            className="btn-primary flex w-full max-w-xs items-center justify-center gap-2 text-lg"
          >
            {isShaking ? (
              <><Sparkles className="h-5 w-5 animate-spin" />正在摇签...</>
            ) : (
              <><Sparkles className="h-5 w-5" />诚心抽一签</>
            )}
          </button>
        </div>
      </div>

      {result && !isShaking && (
        <>
          <div className={`card-classic overflow-hidden ${isRevealed ? "animate-fade-in" : ""}`}>
            <div className="border-b border-border bg-bg-elevated p-6 text-center">
              <p className="mb-1 text-xs text-text-muted">关圣帝君灵签</p>
              <h2 className="mb-3 text-xl font-bold text-gold">{result.title}</h2>
              <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getLevelColor(result.level)}`}>
                第{result.id}签 · {result.level}
              </span>
              {wish && <p className="mt-3 text-xs text-text-secondary">所求：{wish}</p>}
            </div>
            <div className="p-6">
              <div className="divider-ornament mb-4 text-xs">✦ 签诗 ✦</div>
              <div className="rounded-xl bg-bg-input p-5 text-center leading-loose text-text-primary">
                {result.poem.split("\n").map((line, i) => (<p key={i}>{line}</p>))}
              </div>
            </div>
            {!isRevealed ? (
              <div className="p-6 text-center">
                <button onClick={() => setIsRevealed(true)} className="btn-secondary inline-flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" />查看详解
                </button>
              </div>
            ) : (
              <div className="animate-fade-in-up space-y-6 p-6">
                <div>
                  <h3 className="mb-2 text-sm font-bold text-gold">签解</h3>
                  <p className="leading-relaxed text-text-secondary">{result.explanation}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-bold text-gold">师父开示</h3>
                  <p className="leading-relaxed text-text-secondary">{result.kaishi}</p>
                </div>
                <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
                  <h3 className="mb-2 text-sm font-bold text-gold">行动建议</h3>
                  <p className="leading-relaxed text-text-primary">{result.advice}</p>
                </div>
              </div>
            )}
          </div>
          {/* 解签后展示打赏 */}
          {isRevealed && (
            <div className="mt-6">
              <DonateSection variant="compact" text="解签已毕，随喜打赏，福报回向 🙏" />
            </div>
          )}
        </>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <History className="h-4 w-4 text-gold" />
            <h2 className="text-sm font-bold text-gold">求签记录（{history.length}）</h2>
          </div>
          <div className="space-y-2">
            {history.map((record, idx) => (
              <div key={idx} className="card-classic flex items-center justify-between p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] ${getLevelColor(record.level)}`}>{record.level}</span>
                    <span className="truncate text-sm text-text-primary">{record.title}</span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-text-muted">{record.wish} · {record.time}</div>
                </div>
                <button onClick={() => deleteRecord(idx)} className="ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-red-500/10 hover:text-red-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <ShareButton label="分享给好友，广结善缘" />
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">免费抽签 · 心诚则灵 · 仅供娱乐参考</p>
      </div>
    </div>
  );
}

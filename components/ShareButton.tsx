"use client";

import { useState } from "react";
import { Share2, X, Copy, Check, Gift } from "lucide-react";

// 首次访问时为本地生成一个稳定的推广标识，存于 localStorage。
// 不依赖登录态，纯本地。后续若接入真实登录可替换为用户标识。
function getLocalId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("lqt_local_id");
  if (!id) {
    id = Math.random().toString(36).slice(2, 10);
    localStorage.setItem("lqt_local_id", id);
  }
  return id;
}

export function ShareButton({ label = "分享福报" }: { label?: string }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareLink = `${origin}/?ref=${getLocalId()}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
      >
        <Share2 className="h-4 w-4" />
        {label}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="animate-fade-in-up relative w-full max-w-sm rounded-2xl border border-gold/20 bg-bg-card p-6 text-center">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-3 top-3 text-text-muted hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>

            <Gift className="mx-auto mb-3 h-12 w-12 text-gold" />
            <h3 className="mb-2 text-xl font-bold text-gold">分享兰清堂</h3>
            <p className="mb-4 text-sm text-text-secondary">
              将这份清净分享给有缘人
            </p>

            <div className="mb-4 rounded-xl border border-border bg-bg-input p-3">
              <p className="mb-1 text-xs text-text-muted">您的专属推广链接</p>
              <p className="truncate text-sm text-gold">{shareLink}</p>
            </div>

            <button onClick={copyLink} className="btn-primary w-full">
              <span className="flex items-center justify-center gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "已复制" : "复制链接"}
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

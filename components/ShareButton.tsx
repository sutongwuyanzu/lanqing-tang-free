"use client";

import { useState } from "react";
import { Share2, X, Copy, Check, Gift } from "lucide-react";
import { handleShare, refreshLotCount, getCurrentUser } from "@/lib/user-system";

export function ShareButton({ label = "分享福报" }: { label?: string }) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const user = getCurrentUser();
  const shareLink = user
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${user.luckyId}`
    : "";

  const onShare = () => {
    setShowModal(true);
  };

  const doShare = () => {
    const result = handleShare();
    refreshLotCount();
    setShared(true);
    setCopied(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={onShare}
        className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
      >
        <Share2 className="h-4 w-4" />
        {label}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="animate-fade-in-up relative w-full max-w-sm rounded-2xl border border-gold/20 bg-bg-card p-6 text-center">
            <button
              onClick={() => { setShowModal(false); setShared(false); }}
              className="absolute right-3 top-3 text-text-muted hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>

            {!shared ? (
              <>
                <Gift className="mx-auto mb-3 h-12 w-12 text-gold" />
                <h3 className="mb-2 text-xl font-bold text-gold">分享福报</h3>
                <p className="mb-4 text-sm text-text-secondary">
                  分享给朋友，双方各得 <span className="font-bold text-gold">10 福报值</span>
                </p>
                <p className="mb-4 text-xs text-gold">
                  ✨ 分享后立即刷新灵签免费次数（+2次）
                </p>

                <div className="mb-4 rounded-xl border border-border bg-bg-input p-3">
                  <p className="mb-1 text-xs text-text-muted">您的专属推广链接</p>
                  <p className="truncate text-sm text-gold">{shareLink || "请先登录"}</p>
                </div>

                <div className="space-y-2">
                  <button onClick={copyLink} className="btn-secondary w-full">
                    <span className="flex items-center justify-center gap-2">
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      {copied ? "已复制" : "复制链接"}
                    </span>
                  </button>
                  <button onClick={doShare} className="btn-primary w-full">
                    <span className="flex items-center justify-center gap-2">
                      <Share2 className="h-4 w-4" />确认分享得福报
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gold">福报已增加！</h3>
                <p className="mb-2 text-sm text-text-secondary">+10 福报值</p>
                <p className="mb-4 text-xs text-gold">✨ 灵签免费次数已刷新为 2 次</p>
                <button
                  onClick={() => { setShowModal(false); setShared(false); }}
                  className="btn-primary w-full"
                >
                  继续行善
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

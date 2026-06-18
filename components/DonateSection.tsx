"use client";

// 随喜打赏区组件 —— 免费版专用
//
// 两种展示形态：
// - full：首页用，大版块带卡片，含标题+文案+双码+引导
// - compact：结果页用，紧凑版，两码并排
//
// 双码（复用已验证的支付逻辑）：
// - 支付宝：点按钮 alipays:// scheme 一键唤起 App
// - 微信：展示收款码，微信内长按识别 / 微信外保存扫码

import { useState } from "react";
import { Heart, Smartphone, Check, Download } from "lucide-react";
import {
  openAlipay,
  isOpenedInWeChat,
  WECHAT_QR_IMAGE,
} from "@/lib/payment";

interface DonateSectionProps {
  variant?: "full" | "compact";
  text?: string;
}

export function DonateSection({
  variant = "full",
  text,
}: DonateSectionProps) {
  const [triedAlipay, setTriedAlipay] = useState(false);
  const inWeChat =
    typeof navigator !== "undefined" && isOpenedInWeChat();

  const defaultText =
    variant === "full"
      ? "本站所有功能完全免费。若您觉得有用，随缘随喜，功德无量 🙏"
      : "随喜打赏，福报回向 🙏";

  const handleAlipay = () => {
    openAlipay();
    setTriedAlipay(true);
  };

  return (
    <section
      className={
        variant === "full"
          ? "mt-12 mb-8"
          : "mt-2"
      }
    >
      <div
        className={
          variant === "full"
            ? "card-classic overflow-hidden p-6 md:p-8"
            : "rounded-xl border border-gold/20 bg-gold/5 p-4"
        }
      >
        {/* 标题 */}
        <div className="mb-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Heart
              className={variant === "full" ? "h-6 w-6 text-red-400" : "h-4 w-4 text-red-400"}
              fill="currentColor"
            />
            <h2
              className={
                variant === "full"
                  ? "text-xl font-bold text-gold"
                  : "text-base font-bold text-gold"
              }
            >
              随喜打赏
            </h2>
          </div>
          <p
            className={
              variant === "full"
                ? "mx-auto max-w-md text-sm leading-relaxed text-text-secondary"
                : "text-xs text-text-secondary"
            }
          >
            {text || defaultText}
          </p>
        </div>

        {/* 双码并排 */}
        <div
          className={
            variant === "full"
              ? "mx-auto flex max-w-lg flex-col items-center gap-5 sm:flex-row sm:justify-center"
              : "flex items-center justify-center gap-4"
          }
        >
          {/* 支付宝 */}
          <div className="flex flex-col items-center">
            <div
              className={`overflow-hidden rounded-xl border border-[#1677ff]/30 bg-white p-2 ${
                variant === "full" ? "h-40 w-40" : "h-28 w-28"
              }`}
            >
              <img
                src="/alipay-qr.png"
                alt="支付宝打赏码"
                className="h-full w-full object-contain"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                }}
              />
            </div>
            <span className="mt-2 text-xs font-medium text-[#1677ff]">
              支付宝打赏
            </span>
            <button
              onClick={handleAlipay}
              className="mt-1.5 flex items-center gap-1 rounded-lg bg-[#1677ff] px-3 py-1.5 text-[11px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <Smartphone className="h-3 w-3" />
              唤起支付宝
            </button>
          </div>

          {/* 微信 */}
          <div className="flex flex-col items-center">
            <div
              className={`overflow-hidden rounded-xl border border-[#07c160]/30 bg-white p-2 ${
                variant === "full" ? "h-40 w-40" : "h-28 w-28"
              }`}
            >
              <img
                src={WECHAT_QR_IMAGE}
                alt="微信打赏码"
                className="h-full w-full object-contain"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                }}
              />
            </div>
            <span className="mt-2 text-xs font-medium text-[#07c160]">
              微信打赏
            </span>
            <span className="mt-1.5 flex items-center gap-1 px-3 py-1.5 text-[11px] text-text-muted">
              {inWeChat ? (
                <>
                  <Check className="h-3 w-3" />
                  长按识别
                </>
              ) : (
                <>
                  <Download className="h-3 w-3" />
                  保存后扫码
                </>
              )}
            </span>
          </div>
        </div>

        {/* 微信内打开 + 唤起过支付宝时的提示 */}
        {triedAlipay && inWeChat && (
          <p className="mx-auto mt-4 max-w-md rounded-lg bg-yellow-500/10 px-3 py-2 text-center text-[11px] leading-relaxed text-yellow-400">
            微信内无法唤起支付宝，请点右上角 <strong>···</strong> →
            「在浏览器打开」后再点「唤起支付宝」
          </p>
        )}

        <p className="mt-4 text-center text-[10px] text-text-muted">
          随心随喜，一分也是爱 · 感谢您的支持
        </p>
      </div>
    </section>
  );
}

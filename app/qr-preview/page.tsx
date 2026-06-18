"use client";

import { useState } from "react";
import { Download, Check, Shield, AlertTriangle } from "lucide-react";

const qrcodes = [
  {
    file: "alipay-qr.png",
    name: "木色边框款（推荐）",
    desc: "外圈木色画框 + 金线装饰，二维码保留白底",
    safe: true,
    recommend: true,
  },
  {
    file: "alipay-qr-wood.png",
    name: "全木色款",
    desc: "二维码背景也改木色，更统一但需测试扫码",
    safe: false,
    recommend: false,
  },
];

export default function QrPreviewPage() {
  const [selected, setSelected] = useState("alipay-qr.png");

  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gold">收款码样式选择</h1>
        <p className="text-sm text-text-secondary">选择喜欢的木色风格</p>
      </div>

      {/* 大图预览 */}
      <div className="card-classic mb-6 p-6 text-center">
        <p className="mb-3 text-xs text-text-muted">预览效果</p>
        <div className="mx-auto mb-4 max-w-xs overflow-hidden rounded-xl">
          <img
            src={`/${selected}`}
            alt="收款码预览"
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          {qrcodes.find((q) => q.file === selected)?.safe ? (
            <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
              <Shield className="h-3 w-3" />
              可正常扫码
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
              <AlertTriangle className="h-3 w-3" />
              需测试扫码
            </span>
          )}
        </div>
      </div>

      {/* 两个版本选择 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {qrcodes.map((qr) => (
          <button
            key={qr.file}
            onClick={() => setSelected(qr.file)}
            className={`card-classic relative overflow-hidden p-3 transition-all ${
              selected === qr.file ? "!border-gold bg-gold/10" : ""
            }`}
          >
            {qr.recommend && (
              <span className="absolute right-2 top-2 z-10 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-400">
                推荐
              </span>
            )}
            {selected === qr.file && (
              <span className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gold">
                <Check className="h-3 w-3 text-bg-primary" />
              </span>
            )}
            <div className="mb-2 overflow-hidden rounded-lg">
              <img
                src={`/${qr.file}`}
                alt={qr.name}
                className="w-full"
              />
            </div>
            <div className="text-xs font-medium text-text-primary">
              {qr.name}
            </div>
            <div className="mt-0.5 text-[10px] leading-tight text-text-muted">
              {qr.desc}
            </div>
          </button>
        ))}
      </div>

      {/* 下载按钮 */}
      <a
        href={`/${selected}`}
        download={selected}
        className="btn-primary flex w-full items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" />
        下载收款码
      </a>

      {/* 说明 */}
      <div className="card-classic mt-6 p-5">
        <h2 className="mb-3 text-sm font-bold text-gold">📋 说明</h2>
        <div className="space-y-3 text-xs text-text-secondary">
          <div className="flex gap-2">
            <Shield className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-400" />
            <div>
              <span className="font-medium text-green-400">木色边框款（推荐）</span>
              <p className="mt-1">二维码核心区域保持纯白底，支付宝/微信都能正常扫码。外圈木色画框营造古风氛围。</p>
            </div>
          </div>
          <div className="flex gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-400" />
            <div>
              <span className="font-medium text-yellow-400">全木色款</span>
              <p className="mt-1">二维码背景也改成木色，视觉更统一，但可能影响扫码识别率。建议先用支付宝扫描测试。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Check } from "lucide-react";

const logos = [
  { file: "logo-v1-lotus.png", name: "经典款", desc: "金色莲花 + 兰字", recommend: true },
  { file: "logo-v2-seal.png", name: "印章款", desc: "红底金边 + 兰清堂" },
  { file: "logo-v3-lotus-clean.png", name: "纯净款", desc: "金色莲花（无文字）" },
  { file: "logo-v4-zen.png", name: "禅意款", desc: "深色莲花 + 禅字" },
];

export default function LogoPreviewPage() {
  const [selected, setSelected] = useState("logo-v1-lotus.png");

  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gold">兰清堂头像设计</h1>
        <p className="text-sm text-text-secondary">
          选择喜欢的版本，下载后替换支付宝头像
        </p>
      </div>

      {/* 模拟支付宝头像预览 */}
      <div className="card-classic mb-6 p-6 text-center">
        <p className="mb-3 text-xs text-text-muted">支付宝头像预览（圆形）</p>
        <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-gold/30">
          <img
            src={`/${selected}`}
            alt="头像预览"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-sm text-text-secondary">
          {logos.find((l) => l.file === selected)?.name}
        </p>
      </div>

      {/* 4个版本选择 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {logos.map((logo) => (
          <button
            key={logo.file}
            onClick={() => setSelected(logo.file)}
            className={`card-classic relative overflow-hidden p-4 text-center transition-all ${
              selected === logo.file
                ? "!border-gold bg-gold/10"
                : ""
            }`}
          >
            {logo.recommend && (
              <span className="absolute right-2 top-2 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-400">
                推荐
              </span>
            )}
            {selected === logo.file && (
              <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold">
                <Check className="h-3 w-3 text-bg-primary" />
              </span>
            )}
            <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full">
              <img
                src={`/${logo.file}`}
                alt={logo.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-sm font-medium text-text-primary">
              {logo.name}
            </div>
            <div className="mt-0.5 text-[10px] text-text-muted">
              {logo.desc}
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
        下载选中的头像（500×500）
      </a>

      {/* 使用说明 */}
      <div className="card-classic mt-6 p-5">
        <h2 className="mb-3 text-sm font-bold text-gold">📱 如何替换支付宝头像</h2>
        <ol className="space-y-2 text-xs text-text-secondary">
          <li>1. 下载上方选中的头像图片</li>
          <li>2. 打开支付宝 App → 我的 → 点击头像</li>
          <li>3. 个人信息 → 头像 → 从相册选图</li>
          <li>4. 选择刚下载的图片，保存</li>
          <li>5. 重新生成收款码，中间就是新logo了</li>
        </ol>
      </div>
    </div>
  );
}

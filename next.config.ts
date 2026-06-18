import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出模式 - Cloudflare Pages 纯静态托管
  // 不需要 OpenNext Worker，直接输出 HTML/CSS/JS
  output: "export",

  images: {
    unoptimized: true,
  },

  trailingSlash: true,
};

export default nextConfig;

"use client";

// 全局错误边界：静态导出模式下，任何 client 组件抛错（hydration/运行时）
// 都会落到这里显示明确错误，而不是黑屏无报错。
// Next.js 约定：app/error.tsx 必须是 client 组件，自动捕获子树渲染错误。

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 打到控制台，便于用户 F12 查看
    console.error("[兰清堂] 页面渲染错误：", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#1a1410",
        color: "#d4af37",
        fontFamily: "serif",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏮</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
          页面出了点问题
        </h1>
        <p style={{ color: "#a8916b", fontSize: 14, marginBottom: 20 }}>
          抱歉，页面加载时遇到了错误。您可以尝试重新加载，或返回首页。
        </p>

        {error?.message && (
          <pre
            style={{
              background: "#0d0a08",
              color: "#e8c87a",
              padding: "12px",
              borderRadius: 8,
              fontSize: 12,
              textAlign: "left",
              overflowX: "auto",
              marginBottom: 20,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {error.message}
            {error.digest ? `\n[digest: ${error.digest}]` : ""}
          </pre>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              background: "#d4af37",
              color: "#1a1410",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            重试
          </button>
          <a
            href="/"
            style={{
              padding: "10px 20px",
              border: "1px solid #d4af37",
              color: "#d4af37",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}

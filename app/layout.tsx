import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { MusicPlayer } from "@/components/MusicPlayer";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "兰清堂 — 为家人祈福·求灵签·看八字",
  description:
    "以古籍为根，以诚心为引。为家人点一盏祈福灯，求一支关帝灵签，看一卦命理八字。",
  keywords: ["祈福", "灵签", "八字", "解梦", "起名", "周公解梦", "关帝灵签"],
  openGraph: {
    title: "兰清堂",
    description: "为家人祈福·求灵签·看八字",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1a1410",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-serif antialiased">
        <Navbar />
        <MusicPlayer />
        <main className="pb-20 md:pb-8">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

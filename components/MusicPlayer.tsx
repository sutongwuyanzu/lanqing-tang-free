"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Music, Volume2, VolumeX, Pause, Play } from "lucide-react";

// 禅修氛围音乐播放器
// - 音频源：public/music/zen-ambient.mp3（CC0 免版权流水禅音，内置随项目部署，永不失效）
// - 浏览器自动播放策略：页面加载时不能直接播放（会被拦截），
//   监听用户首次任意交互（点击/触摸）后自动开始播放。
// - 用户可手动播放/暂停/静音。

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [triedAutoplay, setTriedAutoplay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // 播放（处理 promise rejection —— 浏览器策略拦截时不报错）
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => setIsPlaying(true)).catch(() => {
        // 被浏览器策略拦截（用户尚未交互），静默处理
        setIsPlaying(false);
      });
    } else {
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  // 首次用户交互后自动播放（核心：解决"不自动播放"问题）
  useEffect(() => {
    if (isAdmin) return;

    let triggered = false;
    const handleFirstInteraction = () => {
      if (triggered) return;
      triggered = true;
      setTriedAutoplay(true);
      // 稍延迟，确保 audio 元素已就绪
      setTimeout(() => play(), 200);
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener("pointerdown", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    // pointerdown 覆盖鼠标和触摸，最全面
    document.addEventListener("pointerdown", handleFirstInteraction, {
      once: false,
    });
    document.addEventListener("keydown", handleFirstInteraction, {
      once: false,
    });
    // 兜底：某些旧浏览器不支持 pointerdown
    document.addEventListener("touchstart", handleFirstInteraction, {
      once: false,
      passive: true,
    });

    return cleanup;
  }, [isAdmin, play]);

  // 切换播放/暂停
  const togglePlay = () => {
    if (isPlaying) pause();
    else play();
  };

  // 静音/取消静音
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  if (isAdmin) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/zen-ambient.mp3"
        loop
        preload="auto"
        // 元素级静音初始态
        muted={muted}
      />
      <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-full border border-gold/20 bg-bg-primary/90 px-3 py-2 backdrop-blur-md md:top-24">
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 text-gold transition-opacity hover:opacity-80"
          title={isPlaying ? "暂停禅音" : "播放禅音"}
          aria-label={isPlaying ? "暂停禅音" : "播放禅音"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <Music className={`h-4 w-4 ${isPlaying ? "animate-pulse" : ""}`} />
        </button>

        <button
          onClick={toggleMute}
          className="text-gold transition-opacity hover:opacity-80"
          title={muted ? "取消静音" : "静音"}
          aria-label={muted ? "取消静音" : "静音"}
        >
          {muted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </>
  );
}

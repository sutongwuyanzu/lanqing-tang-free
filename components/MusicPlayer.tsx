"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Music, Volume2, VolumeX, Pause, Play } from "lucide-react";

// 禅修氛围音乐播放器
// - 音频源：public/music/zen-ambient.mp3（古筝禅音，内置随项目部署）
// - 浏览器自动播放策略：带声音的自动播放一律被拦截。
//   解法：页面加载即以「静音」状态开始播放（所有浏览器都允许静音自动播放），
//   用户首次任意交互（点击/触摸/按键）时，在事件回调里同步取消静音——
//   注意必须在手势同步上下文中调用，不能用 setTimeout，否则手势上下文丢失会被再次拦截。

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  // 初始静音——为了让「静音自动播放」通过浏览器策略
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 是否已通过首次交互解除静音
  const unmutedRef = useRef(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // 挂载即静音播放（静音自动播放不会被拦截）
  useEffect(() => {
    if (isAdmin) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = true;
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => setIsPlaying(true)).catch(() => {
        // 极少数浏览器连静音播放也拦，留给首次交互兜底
        setIsPlaying(false);
      });
    } else {
      setIsPlaying(true);
    }
  }, [isAdmin]);

  // 首次用户交互：同步取消静音（必须在手势回调内同步执行）
  useEffect(() => {
    if (isAdmin) return;

    const handleFirstInteraction = () => {
      if (unmutedRef.current) return;
      unmutedRef.current = true;
      const audio = audioRef.current;
      if (!audio) return;
      // 同步取消静音 + 确保在播（不能放进 setTimeout）
      audio.muted = false;
      setMuted(false);
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener("pointerdown", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("pointerdown", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction, {
      passive: true,
    });

    return cleanup;
  }, [isAdmin]);

  // 切换播放/暂停
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // 用户手动点播放——此时已有手势，可同步取消静音
      if (muted) {
        audio.muted = false;
        unmutedRef.current = true;
        setMuted(false);
      }
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    }
  };

  // 静音/取消静音
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    if (!next) unmutedRef.current = true;
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
        muted
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

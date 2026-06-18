"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ScrollText, MoonStar, Flame, LogOut, ChevronRight, Sparkles, Gift, UserCircle, LogIn } from "lucide-react";
import { getCurrentUser, logout, UserRecord } from "@/lib/user-system";
import { ShareButton } from "@/components/ShareButton";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const handleLogout = () => { logout(); router.push("/"); };

  // 加载中
  if (loading) {
    return (
      <div className="page-container flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 animate-pulse text-gold" />
          <p className="text-sm text-text-muted">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录：显示登录引导
  if (!user) {
    return (
      <div className="page-container">
        <div className="mx-auto max-w-md">
          <div className="card-classic overflow-hidden">
            <div className="bg-gradient-to-br from-gold/20 to-transparent p-8 text-center">
              <UserCircle className="mx-auto mb-4 h-20 w-20 text-gold/40" />
              <h1 className="mb-2 text-2xl font-bold text-gold">个人中心</h1>
              <p className="mb-6 text-sm text-text-secondary">登录后可查看您的吉祥号、福报值和所有记录</p>
              <Link href="/login" className="btn-primary inline-flex items-center gap-2">
                <LogIn className="h-4 w-4" />手机号登录
              </Link>
            </div>
            <div className="border-t border-border p-5">
              <h2 className="mb-3 text-sm font-bold text-text-primary">登录后可以：</h2>
              <div className="space-y-3">
                {[
                  { icon: "🎁", text: "获得专属吉祥号ID" },
                  { icon: "✨", text: "积累福报值，分享给朋友" },
                  { icon: "📜", text: "保存灵签、解梦、祈福记录" },
                  { icon: "🔔", text: "分享链接可刷新免费灵签次数" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-text-secondary">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* 用户信息卡 */}
      <div className="card-classic mb-6 overflow-hidden">
        <div className="bg-gradient-to-br from-gold/20 to-transparent p-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/30 bg-gold/10">
            <Sparkles className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-xl font-bold text-gold">{user.nickname}</h1>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-bg-input px-3 py-1">
            <span className="text-xs text-text-muted">吉祥号</span>
            <span className="text-sm font-bold text-gold">{user.luckyId}</span>
          </div>
        </div>

        {/* 福报值 */}
        <div className="grid grid-cols-4 divide-x divide-border border-t border-border">
          <div className="p-3 text-center">
            <div className="text-xl font-bold text-gold">{user.merit}</div>
            <div className="text-[10px] text-text-muted">福报值</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xl font-bold text-gold">{user.lotRecords.length}</div>
            <div className="text-[10px] text-text-muted">求签</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xl font-bold text-gold">{user.dreamRecords.length}</div>
            <div className="text-[10px] text-text-muted">解梦</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xl font-bold text-gold">{user.lampRecords.length}</div>
            <div className="text-[10px] text-text-muted">点灯</div>
          </div>
        </div>
      </div>

      {/* 分享福报 */}
      <div className="card-classic mb-6 p-5 text-center">
        <Gift className="mx-auto mb-2 h-8 w-8 text-gold" />
        <p className="mb-3 text-sm text-text-secondary">分享善缘，积累福报</p>
        <ShareButton label="分享得10福报" />
      </div>

      {/* 灵签记录 */}
      {user.lotRecords.length > 0 && (
        <div className="card-classic mb-4 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold"><ScrollText className="h-4 w-4" />灵签记录</h2>
          <div className="space-y-2">
            {user.lotRecords.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-bg-input p-2 text-xs">
                <span className="truncate text-text-primary">{r.title}</span>
                <span className="ml-2 flex-shrink-0 text-gold">{r.level}</span>
              </div>
            ))}
          </div>
          {user.lotRecords.length > 5 && <Link href="/lingqian" className="mt-2 block text-center text-xs text-gold">查看全部</Link>}
        </div>
      )}

      {/* 点灯记录 */}
      {user.lampRecords.length > 0 && (
        <div className="card-classic mb-4 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold"><Flame className="h-4 w-4" />祈福记录</h2>
          <div className="space-y-2">
            {user.lampRecords.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-bg-input p-2 text-xs">
                <span className="truncate text-text-primary">{r.lamp} · {r.name}</span>
                <span className="ml-2 flex-shrink-0 text-gold">¥{r.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 功能菜单 */}
      <div className="card-classic mb-6 overflow-hidden">
        {[
          { href: "/lingqian", icon: ScrollText, label: "求灵签", color: "text-gold" },
          { href: "/dream", icon: MoonStar, label: "周公解梦", color: "text-blue-400" },
          { href: "/pray", icon: Flame, label: "为家人祈福", color: "text-red-400" },
        ].map((item, idx, arr) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`flex items-center justify-between p-4 hover:bg-bg-card-hover ${idx !== arr.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-center gap-3"><Icon className={`h-5 w-5 ${item.color}`} /><span className="text-sm text-text-primary">{item.label}</span></div>
              <ChevronRight className="h-4 w-4 text-text-muted" />
            </Link>
          );
        })}
      </div>

      {/* 退出登录 */}
      <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 py-3 text-sm text-red-400 hover:bg-red-500/10">
        <LogOut className="h-4 w-4" />退出登录
      </button>

      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">兰清堂 · 心诚则灵 · 福报自来</p>
      </div>
    </div>
  );
}

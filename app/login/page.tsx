"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Sparkles, ArrowRight } from "lucide-react";
import { loginWithPhone, isValidPhone } from "@/lib/user-system";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = () => {
    if (!isValidPhone(phone)) { setError("请输入正确的手机号"); return; }
    setError("");
    setSentCode(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(timer); return 0; } return c - 1; });
    }, 1000);
  };

  const handleLogin = () => {
    setError("");
    if (!isValidPhone(phone)) { setError("请输入正确的手机号"); return; }
    if (code.length !== 4) { setError("请输入4位验证码"); return; }
    setLoading(true);
    setTimeout(() => { loginWithPhone(phone); router.push("/profile"); }, 800);
  };

  return (
    <div className="page-container">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
          <Sparkles className="h-6 w-6 text-gold" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gold">兰清堂</h1>
        <p className="text-sm text-text-secondary">心诚则灵，福报自来</p>
      </div>
      <div className="card-classic p-6">
        <h2 className="mb-6 text-center text-lg font-bold text-text-primary">手机号登录</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs text-text-muted">手机号</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="请输入手机号" className="input-classic pl-10" maxLength={11} />
            </div>
          </div>
          {sentCode && (
            <div>
              <label className="mb-2 block text-xs text-text-muted">验证码</label>
              <div className="flex gap-2">
                <input type="text" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="4位验证码" className="input-classic" maxLength={4} />
                <button onClick={sendCode} disabled={countdown > 0} className="flex-shrink-0 rounded-xl border border-gold/30 bg-gold/5 px-4 text-sm text-gold disabled:opacity-50">{countdown > 0 ? `${countdown}s` : "重发"}</button>
              </div>
              <p className="mt-1 text-[10px] text-text-muted">演示模式：验证码为任意4位数字</p>
            </div>
          )}
          {!sentCode ? (
            <button onClick={sendCode} disabled={phone.length !== 11} className="btn-secondary w-full">获取验证码</button>
          ) : (
            <button onClick={handleLogin} disabled={loading || code.length !== 4} className="btn-primary w-full">
              <span className="flex items-center justify-center gap-2">{loading ? "登录中..." : "登录"}{!loading && <ArrowRight className="h-4 w-4" />}</span>
            </button>
          )}
          {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>}
        </div>
        <div className="mt-6 space-y-2 text-center text-xs text-text-muted">
          <p>登录后将获得专属吉祥号</p>
          <p>记录您的灵签、解梦、祈福等所有功德</p>
          <p>分享给朋友可获福报值</p>
        </div>
      </div>
    </div>
  );
}

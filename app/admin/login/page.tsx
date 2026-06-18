"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { signInAdmin, getCurrentAdmin } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 已登录直接进仪表盘（加 catch 防止 reject 时静默吞掉）
    getCurrentAdmin()
      .then((a) => {
        if (a) router.replace("/admin");
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signInAdmin(email.trim(), password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    router.replace("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card-classic w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
            <Lock className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-xl font-bold text-gold">兰清堂管理后台</h1>
          <p className="mt-1 text-xs text-text-muted">请输入管理员账号</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-text-secondary">
              邮箱
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="input-classic"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-text-secondary">
              密码
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-classic"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs text-text-muted hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回前台
        </Link>
      </div>
    </div>
  );
}

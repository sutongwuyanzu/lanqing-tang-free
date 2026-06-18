"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle } from "lucide-react";

const navItems = [
  { href: "/lingqian", label: "灵签" },
  { href: "/dream", label: "解梦" },
  { href: "/bazi", label: "起名" },
  { href: "/pray", label: "祈福" },
];

export function Navbar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-primary/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl md:text-3xl">🏮</span>
          <span className="text-xl font-bold tracking-wider text-gold md:text-2xl">
            兰清堂
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-gold/10 text-gold"
                  : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/profile"
            className={`ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/profile"
                ? "bg-gold/10 text-gold"
                : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
            }`}
          >
            <UserCircle className="h-4 w-4" />
            个人中心
          </Link>
        </div>
      </div>
    </nav>
  );
}

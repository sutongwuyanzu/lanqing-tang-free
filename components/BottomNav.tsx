"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Flame,
  CalendarDays,
  ScrollText,
  UserCircle,
  MoreHorizontal,
  X,
} from "lucide-react";

const bottomNavItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/pray", label: "祈福", icon: Flame },
  { href: "/dream", label: "解梦", icon: CalendarDays },
  { href: "/lingqian", label: "灵签", icon: ScrollText },
];

const moreNavItems = [
  { href: "/bazi", label: "八字起名", icon: "👶" },
  { href: "/profile", label: "个人中心", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Overlay */}
      {showMore && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More menu popup */}
      {showMore && (
        <div className="fixed bottom-16 right-3 z-50 w-40 rounded-xl border border-border bg-bg-elevated p-2 shadow-2xl md:hidden animate-fade-in-up">
          {moreNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setShowMore(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-primary/95 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 transition-colors ${
                  isActive ? "text-gold" : "text-text-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* More button - click to toggle */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 transition-colors ${
              showMore ? "text-gold" : "text-text-muted"
            }`}
          >
            {showMore ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
            <span className="text-[10px] font-medium">更多</span>
          </button>
        </div>
        {/* Safe area for iPhone */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}

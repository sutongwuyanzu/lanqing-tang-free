"use client";

import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from "@/lib/classics";
import { useState } from "react";

export default function LibraryPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="page-container">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
            <BookOpen className="h-7 w-7 text-gold" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gold">紫微古籍库</h1>
        <p className="text-sm text-text-secondary">
          {ALL_BOOKS.length} 部经典 · {TOTAL_PARAGRAPHS} 段原文
        </p>
      </div>

      {/* 搜索框 */}
      <div className="mx-auto mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && query.trim()) window.location.href = `/library/search/?q=${encodeURIComponent(query.trim())}`; }}
            placeholder="搜索古籍全文…"
            className="input-classic pl-10"
          />
        </div>
      </div>

      {/* 书籍卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        {ALL_BOOKS.map(book => (
          <Link key={book.slug} href={`/library/${book.slug}/`} className="card-classic p-5 group">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-bold text-text-primary group-hover:text-gold transition-colors">
                《{book.title}》
              </h2>
            </div>
            <div className="mb-3 text-xs text-text-muted">
              {book.dynasty} · {book.author}
            </div>
            <p className="mb-3 text-sm text-text-secondary line-clamp-3">
              {book.intro}
            </p>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span>{book.chapters.length} 章</span>
              <span>{book.wordCount.toLocaleString()} 字</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, BookOpen } from "lucide-react";
import { searchClassics } from "@/lib/classics";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchClassics>>([]);

  useEffect(() => {
    // 从 URL 读取初始查询
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    setQuery(q);
    if (q.trim()) setResults(searchClassics(q.trim()));
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      setResults(searchClassics(query.trim()));
      // 更新 URL（不刷新）
      window.history.replaceState(null, "", `/library/search/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <Link href="/library/" className="text-sm text-text-muted hover:text-gold transition-colors">
          ← 返回古籍库
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-bold text-gold text-center">古籍搜索</h1>

      {/* 搜索框 */}
      <div className="mx-auto mb-8 max-w-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="搜索古籍全文…"
              className="input-classic pl-10"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary px-4">搜索</button>
        </div>
      </div>

      {/* 结果 */}
      {query && (
        <p className="mb-4 text-sm text-text-muted text-center">
          {results.length > 0 ? `找到 ${results.length} 条结果` : `未找到「${query}」相关内容`}
        </p>
      )}

      <div className="mx-auto max-w-3xl space-y-3">
        {results.map(hit => (
          <Link
            key={hit.paragraphId}
            href={`/library/${hit.bookSlug}/`}
            className="card-classic flex items-start gap-3 p-4 group"
          >
            <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex items-center gap-2 text-xs text-text-muted">
                <span className="font-medium text-gold">{hit.bookTitle}</span>
                <span>·</span>
                <span>{hit.chapterTitle}</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: hit.snippet }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

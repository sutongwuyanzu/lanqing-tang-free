import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ALL_BOOKS, getChapter } from "@/lib/classics";

export function generateStaticParams() {
  return ALL_BOOKS.flatMap(b =>
    b.chapters.map((_, i) => ({ book: b.slug, chapter: String(i) }))
  );
}

export default function ChapterPage({ params }: { params: { book: string; chapter: string } }) {
  const chapterIdx = parseInt(params.chapter);
  const result = getChapter(params.book, chapterIdx);

  if (!result) return <div className="page-container text-center text-text-muted py-20">未找到该章节</div>;

  const { book, chapter } = result;
  const prevIdx = chapterIdx > 0 ? chapterIdx - 1 : null;
  const nextIdx = chapterIdx < book.chapters.length - 1 ? chapterIdx + 1 : null;

  return (
    <div className="page-container">
      {/* 面包屑 */}
      <div className="mb-4 flex items-center gap-2 text-sm text-text-muted">
        <Link href="/library/" className="hover:text-gold transition-colors">古籍库</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/library/${book.slug}/`} className="hover:text-gold transition-colors">《{book.title}》</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text-primary">{chapter.title}</span>
      </div>

      {/* 章节标题 */}
      <div className="mb-8 text-center">
        <h1 className="mb-1 text-2xl font-bold text-gold">{chapter.title}</h1>
        {chapter.subtitle && <p className="text-sm text-text-muted">{chapter.subtitle}</p>}
        <p className="text-xs text-text-muted mt-1">《{book.title}》 · {book.dynasty} · {book.author}</p>
      </div>

      {/* 段落 */}
      <div className="mx-auto max-w-3xl space-y-6">
        {chapter.paragraphs.map(p => (
          <div key={p.id} className="card-classic p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-[9px] font-medium text-gold">
                {p.idx}
              </span>
            </div>
            {/* 原文 */}
            <p className="text-base leading-relaxed text-text-primary font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              {p.text}
            </p>
            {/* 白话翻译 */}
            {p.translation && (
              <div className="mt-3 rounded-lg p-3 text-sm text-text-secondary" style={{ background: 'var(--color-bg-input)' }}>
                <span className="text-xs font-medium text-gold mr-2">白话</span>
                {p.translation}
              </div>
            )}
            {/* 倪师注 */}
            {p.niNote && (
              <div className="mt-2 rounded-lg p-3 text-sm text-text-secondary" style={{ background: 'rgba(92,122,74,0.05)', border: '1px solid rgba(92,122,74,0.15)' }}>
                <span className="text-xs font-medium text-gold mr-2">倪师注</span>
                {p.niNote}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 章节导航 */}
      <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between">
        {prevIdx !== null ? (
          <Link href={`/library/${book.slug}/${prevIdx}/`} className="btn-secondary flex items-center gap-1 text-sm">
            <ChevronLeft className="h-4 w-4" /> {book.chapters[prevIdx].title}
          </Link>
        ) : <div />}
        {nextIdx !== null ? (
          <Link href={`/library/${book.slug}/${nextIdx}/`} className="btn-primary flex items-center gap-1 text-sm">
            {book.chapters[nextIdx].title} <ChevronRight className="h-4 w-4" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}

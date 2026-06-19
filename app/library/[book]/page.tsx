import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { ALL_BOOKS, getBookBySlug } from "@/lib/classics";

export function generateStaticParams() {
  return ALL_BOOKS.map(b => ({ book: b.slug }));
}

export default function BookPage({ params }: { params: { book: string } }) {
  const book = getBookBySlug(params.book);
  if (!book) return <div className="page-container text-center text-text-muted py-20">未找到该书籍</div>;

  return (
    <div className="page-container">
      <div className="mb-6">
        <Link href="/library/" className="text-sm text-text-muted hover:text-gold transition-colors">
          ← 返回古籍库
        </Link>
      </div>

      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gold">《{book.title}》</h1>
        <p className="text-sm text-text-muted">{book.dynasty} · {book.author}</p>
        <p className="mt-3 text-sm text-text-secondary max-w-xl mx-auto">{book.intro}</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-2">
        {book.chapters.map((chapter, i) => (
          <Link key={i} href={`/library/${book.slug}/${i}/`} className="card-classic flex items-center justify-between p-4 group">
            <div>
              <h2 className="text-base font-medium text-text-primary group-hover:text-gold transition-colors">
                {chapter.title}
              </h2>
              {chapter.subtitle && <p className="text-xs text-text-muted mt-0.5">{chapter.subtitle}</p>}
              <p className="text-xs text-text-muted mt-1">{chapter.paragraphs.length} 段</p>
            </div>
            <ChevronRight className="h-4 w-4 text-text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}

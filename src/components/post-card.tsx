import Image from 'next/image';
import Link from 'next/link';
import type { PostSummary } from '@/lib/api';
import DraftBadge from '@/components/draft-badge';

export function formatPostDate(date: string, month: 'short' | 'long' = 'short'): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Unknown date';

  return parsed.toLocaleDateString('en-US', { month, day: 'numeric', year: 'numeric' });
}

export function formatCategoryTypeLabel(category: string, type: string): string {
  const trimmedCategory = category.trim();
  return trimmedCategory ? `${trimmedCategory} ${type}` : type;
}

export default function PostCard({ post, compact = false }: { post: PostSummary; compact?: boolean }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      prefetch={false}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl border bg-[var(--color-tertiary)] transition-transform hover:scale-[1.01] ${
        compact ? 'min-h-[260px] p-6' : 'min-h-[360px] p-7'
      } ${post.draft ? 'border-2 border-dashed border-amber-400' : 'border-[var(--color-border)]'}`}
    >
      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="absolute inset-0 object-cover brightness-75 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/45 to-black/20" />

      {post.draft && <DraftBadge className="absolute left-5 top-5 z-10" />}

      <div className="relative z-10">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#f6eae5]">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true">🞄</span>
          <span>{formatCategoryTypeLabel(post.category, post.type)}</span>
          <span aria-hidden="true">🞄</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h2
          className={`font-serif font-bold leading-tight text-white transition-colors group-hover:text-[#f7e7e2] ${
            compact ? 'text-2xl' : 'text-3xl'
          }`}
        >
          {post.title}
        </h2>
        {!compact && (
          <p className="mt-3 text-sm leading-relaxed text-[#f6eae5]">
            {post.excerpt || 'A brief reflection on recent learnings and experiences.'}
          </p>
        )}
      </div>
    </Link>
  );
}

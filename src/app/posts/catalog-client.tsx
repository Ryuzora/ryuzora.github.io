'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const POSTS_PER_PAGE = 9;

interface Post {
  slug: string;
  title: string;
  date: string;
  type: string;
  excerpt: string;
  thumbnail: string;
}

function getPageFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

function normalizePostType(value: string): string {
  return value.trim().toLowerCase().replace(/s$/, '');
}

function normalizeSort(value: string | null): 'latest' | 'chronological' | '' {
  const normalized = (value ?? '').trim().toLowerCase();
  if (normalized === 'latest') return 'latest';
  if (normalized === 'chronological') return 'chronological';
  return '';
}

function getPostTimestamp(date: string): number {
  const parsed = new Date(date).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatTypeLabel(type: string): string {
  if (type === 'review') return 'Reviews';
  if (type === 'opinion') return 'Opinions';
  if (type === 'project') return 'Projects';
  return 'Posts';
}

function buildCatalogHref(page: number, typeFilter: string, sort: 'latest' | 'chronological' | ''): string {
  const params = new URLSearchParams();

  if (typeFilter) {
    params.set('type', typeFilter);
  }

  if (sort) {
    params.set('sort', sort);
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  const query = params.toString();
  return query ? `/posts?${query}` : '/posts';
}

function formatPostDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Unknown date';

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CatalogClient({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();

  const typeFilter = normalizePostType(searchParams.get('type') ?? '');
  const sort = normalizeSort(searchParams.get('sort'));
  const filteredPosts = typeFilter
    ? posts.filter((post) => normalizePostType(post.type || '') === typeFilter)
    : posts;
  const sortedPosts = [...filteredPosts].sort((post1, post2) => {
    if (sort === 'chronological') {
      return getPostTimestamp(post1.date) - getPostTimestamp(post2.date);
    }
    if (sort === 'latest') {
      return getPostTimestamp(post2.date) - getPostTimestamp(post1.date);
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(
    getPageFromSearchParam(searchParams.get('page')),
    totalPages
  );

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const pageTitle = typeFilter ? `${formatTypeLabel(typeFilter)} Catalog` : 'Post Catalog';

  return (
    <>
      <div className="mb-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-stone-900 sm:text-5xl">
            {pageTitle}
          </h1>
          <p className="mt-2 text-stone-600">
            Browse {filteredPosts.length}{' '}
            {typeFilter ? formatTypeLabel(typeFilter).toLowerCase() : 'posts'} in a paginated
            grid for faster loads as your archive grows.
          </p>
        </div>
      </div>

      {pagePosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pagePosts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              prefetch={false}
              className="group relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-3xl bg-stone-950 p-7 transition-transform hover:scale-[1.01]"
            >
              {post.thumbnail && (
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="absolute inset-0 object-cover brightness-90 transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/20" />

              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-3 text-sm text-stone-200/90">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <span>{post.type || 'Opinion'}</span>
                </div>
                <h2 className="font-serif text-3xl font-bold leading-tight text-white transition-colors group-hover:text-stone-200">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-200/85">
                  {post.excerpt || 'A brief reflection on recent learnings and experiences.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-600">
          No posts found for this filter yet.
        </div>
      )}

      <nav className="mt-10 flex items-center justify-between" aria-label="Pagination">
        <Link
          href={buildCatalogHref(currentPage > 1 ? currentPage - 1 : 1, typeFilter, sort)}
          aria-disabled={currentPage <= 1}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            currentPage <= 1
              ? 'pointer-events-none border-stone-200 text-stone-400'
              : 'border-stone-300 text-stone-700 hover:border-stone-400 hover:text-stone-900'
          }`}
        >
          Previous
        </Link>

        <p className="text-sm text-stone-600">
          Page {currentPage} of {totalPages}
        </p>

        <Link
          href={buildCatalogHref(currentPage < totalPages ? currentPage + 1 : totalPages, typeFilter, sort)}
          aria-disabled={currentPage >= totalPages}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            currentPage >= totalPages
              ? 'pointer-events-none border-stone-200 text-stone-400'
              : 'border-stone-300 text-stone-700 hover:border-stone-400 hover:text-stone-900'
          }`}
        >
          Next
        </Link>
      </nav>
    </>
  );
}


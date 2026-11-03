'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PostSummary } from '@/lib/api';
import PostCard from '@/components/post-card';

const POSTS_PER_PAGE = 9;

type SortOrder = 'latest' | 'chronological' | '';

interface CatalogFilters {
  type: string;
  category: string;
  tag: string;
  q: string;
  sort: SortOrder;
  page: number;
}

function getPageFromSearchParam(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

function normalizePostType(value: string): string {
  return value.trim().toLowerCase().replace(/s$/, '');
}

function normalizeSort(value: string | null): SortOrder {
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
  if (type === 'ranking') return 'Rankings';
  return 'Posts';
}

function buildCatalogHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();

  if (filters.type) params.set('type', filters.type);
  if (filters.category) params.set('category', filters.category);
  if (filters.tag) params.set('tag', filters.tag);
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page > 1) params.set('page', String(filters.page));

  const query = params.toString();
  return query ? `/posts?${query}` : '/posts';
}

function matchesSearch(post: PostSummary, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [post.title, post.excerpt, post.category, post.type, ...post.tags].join(' ').toLowerCase();
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

function uniqueSorted(values: string[]): string[] {
  const byKey = new Map<string, string>();
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed && !byKey.has(trimmed.toLowerCase())) byKey.set(trimmed.toLowerCase(), trimmed);
  }
  return Array.from(byKey.values()).sort((a, b) => a.localeCompare(b));
}

const selectClassName =
  'rounded-full border border-[var(--color-border)] bg-[var(--color-neutral)] px-4 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]';

export default function CatalogClient({ posts }: { posts: PostSummary[] }) {
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const filters: CatalogFilters = {
    type: normalizePostType(searchParams.get('type') ?? ''),
    category: (searchParams.get('category') ?? '').trim(),
    tag: (searchParams.get('tag') ?? '').trim().toLowerCase(),
    q: urlQuery,
    sort: normalizeSort(searchParams.get('sort')),
    page: getPageFromSearchParam(searchParams.get('page')),
  };

  // The search box keeps its own state so typing never lags behind the URL.
  // When the URL changes from elsewhere (navbar, back button), the box follows it.
  const [query, setQuery] = useState(urlQuery);
  const [lastSeenUrlQuery, setLastSeenUrlQuery] = useState(urlQuery);
  const [lastWrittenQuery, setLastWrittenQuery] = useState(urlQuery);
  if (urlQuery !== lastSeenUrlQuery) {
    setLastSeenUrlQuery(urlQuery);
    if (urlQuery !== lastWrittenQuery.trim()) setQuery(urlQuery);
  }

  function updateFilters(changes: Partial<CatalogFilters>) {
    // Any filter change sends you back to page 1.
    const next = { ...filters, q: query, ...changes, page: changes.page ?? 1 };
    window.history.replaceState(null, '', buildCatalogHref(next));
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    setLastWrittenQuery(value);
    updateFilters({ q: value });
  }

  function clearFilters() {
    setQuery('');
    setLastWrittenQuery('');
    window.history.replaceState(null, '', filters.sort ? `/posts?sort=${filters.sort}` : '/posts');
  }

  const categories = uniqueSorted(posts.map((post) => post.category));

  const filteredPosts = posts.filter((post) => {
    if (filters.type && normalizePostType(post.type || '') !== filters.type) return false;
    if (filters.category && post.category.toLowerCase() !== filters.category.toLowerCase()) return false;
    if (filters.tag && !post.tags.includes(filters.tag)) return false;
    return matchesSearch(post, query);
  });

  const sortedPosts = [...filteredPosts].sort((post1, post2) => {
    if (filters.sort === 'chronological') {
      return getPostTimestamp(post1.date) - getPostTimestamp(post2.date);
    }
    return getPostTimestamp(post2.date) - getPostTimestamp(post1.date);
  });

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(filters.page, totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const pageTitle = filters.type ? formatTypeLabel(filters.type) : 'All Posts';
  const hasFilters = Boolean(filters.type || filters.category || filters.tag || query.trim());
  const pageHref = (page: number) => buildCatalogHref({ ...filters, q: query, page });

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-secondary)] sm:text-5xl">{pageTitle}</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          {filters.category && <> in <strong>{filters.category}</strong></>}
          {filters.tag && <> tagged <strong>#{filters.tag}</strong></>}
          {query.trim() && <> matching &ldquo;{query.trim()}&rdquo;</>}
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search posts</span>
          <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Cari judul, kategori, atau tag..."
            className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-neutral)] py-2 pl-10 pr-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <label>
            <span className="sr-only">Type</span>
            <select
              value={filters.type}
              onChange={(event) => updateFilters({ type: event.target.value })}
              className={selectClassName}
            >
              <option value="">All types</option>
              <option value="review">Reviews</option>
              <option value="opinion">Opinions</option>
              <option value="ranking">Rankings</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Category</span>
            <select
              value={categories.find((category) => category.toLowerCase() === filters.category.toLowerCase()) ?? ''}
              onChange={(event) => updateFilters({ category: event.target.value })}
              className={selectClassName}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Sort</span>
            <select
              value={filters.sort === 'chronological' ? 'chronological' : 'latest'}
              onChange={(event) => updateFilters({ sort: normalizeSort(event.target.value) })}
              className={selectClassName}
            >
              <option value="latest">Newest first</option>
              <option value="chronological">Oldest first</option>
            </select>
          </label>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tags are reached from the tag links on each post (or by searching),
          so there is no tag dropdown. When one is active, show it here. */}
      {filters.tag && (
        <div className="-mt-4 mb-8 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span>Filtered by tag:</span>
          <button
            type="button"
            onClick={() => updateFilters({ tag: '' })}
            aria-label={`Remove tag filter #${filters.tag}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)] bg-[color:color-mix(in_srgb,var(--color-primary)_12%,white)] px-3 py-1 font-semibold text-[var(--color-primary)] transition hover:bg-[color:color-mix(in_srgb,var(--color-primary)_20%,white)]"
          >
            #{filters.tag}
            <span aria-hidden="true" className="text-base leading-none">×</span>
          </button>
        </div>
      )}

      {pagePosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pagePosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-text-muted)]">
          Nggak ada post yang cocok.{' '}
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="font-semibold text-[var(--color-primary)] hover:underline">
              Hapus filter
            </button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-between" aria-label="Pagination">
          <Link
            href={pageHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage <= 1}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              currentPage <= 1
                ? 'pointer-events-none border-[var(--color-border)] text-[var(--color-text-muted)]'
                : 'border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            Previous
          </Link>

          <p className="text-sm text-[var(--color-text-muted)]">
            Page {currentPage} of {totalPages}
          </p>

          <Link
            href={pageHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage >= totalPages}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              currentPage >= totalPages
                ? 'pointer-events-none border-[var(--color-border)] text-[var(--color-text-muted)]'
                : 'border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            Next
          </Link>
        </nav>
      )}
    </>
  );
}

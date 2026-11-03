import Link from 'next/link';
import Image from 'next/image';
import type { PostSummary, PostType } from '@/lib/api';
import DraftBadge from '@/components/draft-badge';
import PostCard, { formatCategoryTypeLabel, formatPostDate } from '@/components/post-card';

const RECENT_LIST_SIZE = 4;
const POSTS_PER_TYPE = 3;

const typeSections: { type: PostType; title: string; blurb: string; href: string }[] = [
  { type: 'Review', title: 'Reviews', blurb: 'Drama, film, dan apa pun yang baru aku tonton.', href: '/posts?type=review' },
  { type: 'Ranking', title: 'Rankings', blurb: 'Top 5 versi aku. Boleh nggak setuju.', href: '/posts?type=ranking' },
  { type: 'Opinion', title: 'Opinions', blurb: 'Pendapat pribadi, kadang sambil ngomel.', href: '/posts?type=opinion' },
];

function SectionHeader({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-[var(--color-border)] pb-3">
      <h2 className="font-serif text-3xl font-bold text-[var(--color-secondary)]">{title}</h2>
      <Link
        href={href}
        className="shrink-0 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

function FeaturedCard({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group relative flex min-h-[26rem] w-full flex-col justify-end overflow-hidden rounded-3xl border bg-[var(--color-secondary)] p-8 transition-transform hover:scale-[1.01] sm:p-10 lg:h-full ${
        post.draft ? 'border-2 border-dashed border-amber-400' : 'border-[var(--color-border)]'
      }`}
    >
      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="absolute inset-0 object-cover brightness-50 transition-transform duration-700 ease-out group-hover:scale-105"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

      <div className="absolute left-8 top-8 z-10 flex flex-wrap items-center gap-2 sm:left-10 sm:top-10">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Terbaru
        </span>
        {post.draft && <DraftBadge />}
      </div>

      <div className="relative z-10 max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#f2ddd7]">
          {formatCategoryTypeLabel(post.category, post.type)} · {post.readingTime} min read
        </p>
        <h3 className="font-serif text-4xl font-bold leading-tight text-white transition-colors group-hover:text-[#f7e7e2] sm:text-5xl">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-4 line-clamp-3 text-base text-[#f2ddd7] sm:text-lg">{post.excerpt}</p>}
      </div>
    </Link>
  );
}

function RecentRow({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-[var(--color-surface)] ${
        post.draft ? 'border-2 border-dashed border-amber-400' : ''
      }`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--color-tertiary)] sm:h-24 sm:w-24">
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt=""
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[var(--color-tertiary)]">
          {formatCategoryTypeLabel(post.category, post.type)}
        </p>
        <h3 className="mt-1 line-clamp-2 font-serif text-lg font-bold leading-snug text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
          {post.title}
        </h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {formatPostDate(post.date)} · {post.readingTime} min read
        </p>
        {post.draft && <DraftBadge className="mt-2 scale-90 origin-left" />}
      </div>
    </Link>
  );
}

export default function FeaturedLayout({ posts }: { posts: PostSummary[] }) {
  if (!posts || posts.length === 0) return null;

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 1 + RECENT_LIST_SIZE);

  // Category counts, most-used first, for the "browse" chips.
  const categoryCounts = new Map<string, number>();
  for (const post of posts) {
    if (post.category) categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
  }
  const categories = Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 py-16">
      {/* 1. Newest post + the next few as a compact list */}
      <section className="flex flex-col gap-6">
        <SectionHeader title="Latest Posts" href="/posts" linkLabel="Lihat semua" />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <FeaturedCard post={featuredPost} />
          {recentPosts.length > 0 && (
            <div className="flex flex-col gap-1 rounded-3xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface)_60%,white)] p-3">
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Baru juga
              </p>
              {recentPosts.map((post) => (
                <RecentRow key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Browse by category */}
      {categories.length > 0 && (
        <section className="rounded-3xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-tertiary)_14%,white)] px-6 py-10 text-center sm:px-10">
          <h2 className="font-serif text-3xl font-bold text-[var(--color-primary)]">Lagi pengen baca apa?</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[var(--color-text-muted)]">Pilih topik, nanti aku tunjukin semua tulisannya.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {categories.map(([category, count]) => (
              <Link
                key={category}
                href={`/posts?category=${encodeURIComponent(category)}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-neutral)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                {category}
                <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. A row per post type */}
      {typeSections.map((section) => {
        const sectionPosts = posts.filter((post) => post.type === section.type).slice(0, POSTS_PER_TYPE);
        if (sectionPosts.length === 0) return null;

        return (
          <section key={section.type} className="flex flex-col gap-6">
            <div>
              <SectionHeader title={section.title} href={section.href} linkLabel={`Semua ${section.title.toLowerCase()}`} />
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">{section.blurb}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sectionPosts.map((post) => (
                <PostCard key={post.slug} post={post} compact />
              ))}
            </div>
          </section>
        );
      })}

      <div className="flex justify-center">
        <Link
          href="/posts"
          className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-secondary)]"
        >
          Lihat semua post
        </Link>
      </div>
    </div>
  );
}

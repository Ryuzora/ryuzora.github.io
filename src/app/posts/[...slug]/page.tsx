import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import rehypeRaw from 'rehype-raw';
import { getAdjacentPosts, getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/api';
import type { PostSummary } from '@/lib/api';
import DraftBadge from '@/components/draft-badge';
import PostCard, { formatCategoryTypeLabel, formatPostDate } from '@/components/post-card';

interface PostPageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams(): { slug: string[] }[] {
  return getAllPosts().map((post) => ({ slug: post.slug.split('/') }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug.join('/'));
  const description = post.excerpt || undefined;
  const images = post.thumbnail ? [post.thumbnail] : undefined;

  return {
    title: post.draft ? `[Draft] ${post.title}` : post.title,
    description,
    keywords: post.tags,
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      publishedTime: post.date,
      tags: post.tags,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      images,
    },
  };
}

function PostNavLink({ post, direction }: { post: PostSummary | null; direction: 'newer' | 'older' }) {
  if (!post) return <div className="hidden sm:block" />;

  const isNewer = direction === 'newer';

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group flex flex-col gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-primary)] ${
        isNewer ? 'sm:items-start' : 'sm:items-end sm:text-right'
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
        {isNewer ? '← Newer' : 'Older →'}
      </span>
      <span className="font-serif text-lg font-bold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
        {post.title}
      </span>
      {post.draft && <DraftBadge className="mt-1" />}
    </Link>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');
  const post = getPostBySlug(slug);
  const { newer, older } = getAdjacentPosts(slug);
  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <main className="min-h-screen bg-[var(--color-neutral)] px-6 py-16 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-12">
          <Link
            href="/posts"
            className="text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
          >
            ← Back to posts
          </Link>
        </nav>

        {post.draft && (
          <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            <DraftBadge />
            <span>This post is a draft. It only shows up in local dev and won&apos;t be published.</span>
          </div>
        )}

        <header className="mb-12 border-b border-[var(--color-border)] pb-10">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[var(--color-text)] sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
              {post.excerpt}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            <time dateTime={post.date}>{formatPostDate(post.date, 'long')}</time>
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)]" />
            <span>{formatCategoryTypeLabel(post.category, post.type)}</span>
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-text-muted)]" />
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {post.thumbnail && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
            />
          </div>
        )}

        <article className="prose prose-stone max-w-3xl prose-headings:font-serif prose-headings:font-bold prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline prose-li:text-justify prose-img:mx-auto lg:prose-xl">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ node, ...props }: any) => {
                let src = String(props.src || '');
                if (src.includes('public/')) {
                  src = src.split('public/')[1];
                }
                const fixedSrc = src.startsWith('/') ? src : '/' + src;

                return (
                  <img
                    {...props}
                    src={fixedSrc}
                    alt={props.alt || ''}
                    loading="lazy"
                    className="my-8 h-auto w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] object-cover"
                  />
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {(newer || older) && (
          <nav aria-label="More posts" className="mt-16 grid gap-4 border-t border-[var(--color-border)] pt-10 sm:grid-cols-2">
            <PostNavLink post={newer} direction="newer" />
            <PostNavLink post={older} direction="older" />
          </nav>
        )}
      </div>

      {relatedPosts.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-6 font-serif text-3xl font-bold text-[var(--color-secondary)]">You might also like</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <PostCard key={related.slug} post={related} compact />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

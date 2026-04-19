import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { getAllPosts, getPostBySlug } from '@/lib/api';
import PostBackButton from './post-back-button';

interface PostPageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams(): { slug: string[] }[] {
  return getAllPosts().map((post) => ({ slug: post.slug.split('/') }));
}

export const dynamicParams = false;

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');
  const post = getPostBySlug(slug);

  return (
    <main className="min-h-screen bg-[var(--color-neutral)] px-6 py-16 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-12">
          <PostBackButton />
        </nav>

        <header className="mb-12 border-b border-[var(--color-border)] pb-10">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[var(--color-text)] sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
              {post.excerpt}
            </p>
          )}
          <div className="mt-5 flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </p>
            <p className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-secondary)]">
              {post.type}
            </p>
            {post.category && (
              <p className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {post.category}
              </p>
            )}
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
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12 border-t border-[var(--color-border)] pt-8">
          <PostBackButton />
        </div>
      </div>
    </main>
  );
}

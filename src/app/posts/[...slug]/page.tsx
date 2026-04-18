import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/api';

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
    <main className="min-h-screen bg-stone-50 px-6 py-16 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-amber-700"
          >
            <span aria-hidden="true">←</span>
            All posts
          </Link>
        </nav>

        <header className="mb-12 border-b border-stone-200 pb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            {post.title}
          </h1>
        </header>

        <article className="prose prose-stone lg:prose-xl prose-headings:font-serif prose-headings:font-bold prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}


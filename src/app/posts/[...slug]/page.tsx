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
    <main className="min-h-screen bg-stone-50 px-6 py-16 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-12">
          <PostBackButton />
        </nav>

        <header className="mb-12 border-b border-stone-200 pb-10">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-base leading-relaxed text-stone-600 sm:text-lg">
              {post.excerpt}
            </p>
          )}
          <div className="mt-5 flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </p>
            <p className="inline-flex rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-600">
              {post.type}
            </p>
          </div>
        </header>

        {post.thumbnail && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-stone-200 bg-stone-100">
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

        <article className="prose prose-stone lg:prose-xl max-w-3xl prose-headings:font-serif prose-headings:font-bold prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline prose-li:text-justify prose-img:mx-auto">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
}

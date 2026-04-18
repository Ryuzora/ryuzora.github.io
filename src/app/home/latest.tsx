import Link from 'next/link';
import Image from 'next/image';

interface Post {
  slug: string;
  title: string;
  type?: string;
  excerpt?: string;
  thumbnail?: string;
  date?: string;
}

export default function FeaturedLayout({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 5); // Grabs the 2nd and 3rd posts

  return (
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col gap-6">
        <h1 className="text-2xl text-stone-700">Latest Posts</h1>
        <Link
            href={`/posts/${featuredPost.slug}`}
            className="group relative flex flex-col justify-end min-h-112.5 w-full overflow-hidden rounded-3xl bg-stone-950 p-8 sm:p-12 transition-transform hover:scale-[1.01]"
        >
          {featuredPost.thumbnail && (
            <Image
              src={featuredPost.thumbnail}
              alt={featuredPost.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="absolute inset-0 object-cover brightness-30 transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
          )}
          {/* Subtle Background Pattern/Gradient Placeholder */}
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-stone-700 via-stone-950 to-stone-950"></div>

          <div className="relative z-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              {featuredPost.type}
            </p>
            <h2 className="font-serif text-4xl font-bold text-white sm:text-6xl transition-colors group-hover:text-stone-200">
              {featuredPost.title}
            </h2>
            <p className="mt-4 text-lg text-stone-400 sm:text-xl">
              {featuredPost.excerpt || "Exploring new thoughts and ideas in the digital space."}
            </p>
          </div>
        </Link>

        {/* 2. The Recent Posts Grid (Image Overlay Theme) */}
        {recentPosts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recentPosts.map((post) => (
                  <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
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
                        {post.date && (
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                        )}
                        <span>{post.type || 'Opinion'}</span>
                      </div>
                      <h3 className="font-serif text-3xl font-bold leading-tight text-white transition-colors group-hover:text-stone-200">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-stone-200/85">
                        {post.excerpt || 'A brief reflection on recent learnings and experiences.'}
                      </p>
                    </div>
                  </Link>
              ))}
            </div>
        )}

        {/* 3. The Quote Block (Pinkish Theme) */}
        <div className="rounded-3xl bg-[#F6DAED] p-10 sm:p-16 text-center mt-2">
          <blockquote className="mx-auto max-w-3xl">
            <p className="font-serif text-2xl leading-relaxed text-stone-900 sm:text-3xl">
              &ldquo;Design is not just what it looks like and feels like. Design is how it works... but a little tactile warmth never hurt anyone.&rdquo;
            </p>
            <footer className="mt-6 text-sm font-semibold text-purple-900/60">
              — Steve Jobs, Modified
            </footer>
          </blockquote>
        </div>

      </div>
  );
}

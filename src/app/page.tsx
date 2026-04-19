import { getAllPosts } from '@/lib/api';
import Hero from '@/app/home/hero'
import Latest from '@/app/home/latest'

export default function HomePage() {
  const posts = getAllPosts();

  return (
      <main className="min-h-screen bg-[var(--color-neutral)]">
        <Hero/>
        <Latest posts={posts}/>
      </main>
  );
}
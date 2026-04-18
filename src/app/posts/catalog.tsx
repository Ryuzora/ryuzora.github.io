import { Suspense } from 'react';
import { getAllPosts } from '@/lib/api';
import CatalogClient from './catalog-client';
export default function CatalogPage() {
  const allPosts = getAllPosts();

  return (
	<main className="min-h-screen bg-stone-50 px-6 py-12 sm:px-10 lg:px-20">
	  <section className="mx-auto max-w-7xl">
		<Suspense fallback={<div className="text-sm text-stone-500">Loading catalog...</div>}>
		  <CatalogClient posts={allPosts} />
		</Suspense>
	  </section>
	</main>
  );
}


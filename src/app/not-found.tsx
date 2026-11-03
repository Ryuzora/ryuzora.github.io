import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halaman tidak ditemukan',
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[var(--color-neutral)] px-6 py-16">
      <div className="max-w-xl text-center">
        <p className="font-serif text-8xl font-extrabold text-[color:color-mix(in_srgb,var(--color-primary)_35%,white)] sm:text-9xl">
          404
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
          Halaman ini nggak ada
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
          Mungkin link-nya salah, atau tulisannya udah dipindah. Coba cari dari daftar post aja.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/posts"
            className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-secondary)]"
          >
            Lihat semua post
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]"
          >
            Ke beranda
          </Link>
        </div>
      </div>
    </main>
  );
}

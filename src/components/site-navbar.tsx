'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type NavLink = {
  key: 'home' | 'latest' | 'reviews' | 'opinions' | 'projects' | 'about';
  name: string;
  href: string;
};

const navLinks: NavLink[] = [
  { key: 'home', name: 'Home', href: '/' },
  { key: 'latest', name: 'Latest', href: '/posts?sort=latest' },
  { key: 'reviews', name: 'Reviews', href: '/posts?type=review' },
  { key: 'opinions', name: 'Opinions', href: '/posts?type=opinion' },
  { key: 'projects', name: 'Projects', href: '/posts?type=project' },
  { key: 'about', name: 'About', href: '/about' },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const normalizeParam = (value: string | null): string => {
    if (!value) return '';
    return value.trim().toLowerCase().replace(/s$/, '');
  };

  const activeType = normalizeParam(searchParams.get('type'));
  const activeSort = normalizeParam(searchParams.get('sort'));

  let activePostsKey: NavLink['key'] | null = null;
  if (pathname === '/posts') {
    if (activeType === 'review') activePostsKey = 'reviews';
    else if (activeType === 'opinion') activePostsKey = 'opinions';
    else if (activeType === 'project') activePostsKey = 'projects';
    else if (activeSort === 'latest' || !activeType) activePostsKey = 'latest';
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;

      if (currentScrollY < 24) {
        setIsNavVisible(true);
      } else if (currentScrollY > previousScrollY + 8) {
        setIsNavVisible(false);
      } else if (currentScrollY < previousScrollY - 8) {
        setIsNavVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-neutral)] px-6 py-3 backdrop-blur transition-transform duration-300 lg:px-8 ${mobileMenuOpen || isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 items-center">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="font-serif text-2xl font-bold text-[var(--color-primary)]">The Throne</span>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          <nav className="hidden lg:flex lg:items-center lg:justify-center lg:gap-x-8">
            {navLinks.map((link) => {
              const active =
                (link.key === 'home' && pathname === '/') ||
                (link.key === 'about' && pathname === '/about') ||
                (activePostsKey !== null && link.key === activePostsKey);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`pb-1 text-sm font-medium transition-colors ${
                    active
                      ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-b-2 hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex lg:justify-end lg:items-center">
            <form role="search" className="w-full max-w-xs">
              <label htmlFor="desktop-search" className="sr-only">
                Search posts
              </label>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
                <input
                  id="desktop-search"
                  name="q"
                  type="search"
                  placeholder="Search posts..."
                  className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-neutral)] py-1.5 pl-10 pr-4 text-xs text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[var(--color-neutral)] p-6 sm:max-w-sm sm:ring-1 sm:ring-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="font-serif text-3xl font-bold text-[var(--color-primary)]">The Throne</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-[var(--color-border)]">
                <div className="space-y-2 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

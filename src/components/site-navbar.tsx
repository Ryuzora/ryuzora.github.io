'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = {
  key: 'home' | 'latest' | 'reviews' | 'opinions' | 'projects' | 'about';
  name: string;
  href: string;
};

const navLinks: NavLink[] = [
  { key: 'home', name: 'Home', href: '/' },
  { key: 'latest', name: 'Latest', href: '/posts?sort=latest' },
  { key: 'reviews', name: 'Reviews', href: '/posts?type=reviews' },
  { key: 'opinions', name: 'Opinions', href: '/posts?type=opinions' },
  { key: 'projects', name: 'Projects', href: '/posts?type=projects' },
  { key: 'about', name: 'About', href: '/#about' },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);

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
        className={`fixed inset-x-0 top-0 z-40 border-b border-stone-200 bg-stone-50/95 px-6 py-3 backdrop-blur transition-transform duration-300 lg:px-8 ${mobileMenuOpen || isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-w-0 items-center">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="font-serif text-2xl font-bold text-stone-950">The Throne</span>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-stone-600 hover:text-stone-950"
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
                (link.key === 'latest' && pathname === '/posts');
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`pb-1 text-sm font-medium transition-colors ${
                    active
                      ? 'border-b-2 border-amber-800 text-stone-950'
                      : 'text-stone-700 hover:text-stone-950 hover:border-b-2 hover:border-amber-800/50'
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
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
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
                  className="w-full rounded-full border border-stone-300 bg-stone-50 py-1.5 pl-10 pr-4 text-xs text-stone-900 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-800/20"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-stone-50 p-6 sm:max-w-sm sm:ring-1 sm:ring-stone-100/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="font-serif text-3xl font-bold text-stone-950">The Throne</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-stone-600 hover:text-stone-950"
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
              <div className="-my-6 divide-y divide-stone-200">
                <div className="space-y-2 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950"
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

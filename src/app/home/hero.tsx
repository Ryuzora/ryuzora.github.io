"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Hero() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '#essays', active: true },
        { name: 'Latest', href: '/posts?sort=latest' },
        { name: 'Reviews', href: '/posts?type=reviews' },
        { name: 'Opinions', href: '/posts?type=opinions' },
        { name: "Projects", href: '/posts?type=projects' },
        { name: 'About', href: '#about' },
    ];

    return (
        <div className="bg-stone-50 min-h-screen text-stone-900 px-6 py-2">
            <div
                className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
                aria-hidden="true"
            />

            {/* Header / Navigation Bar */}
            <header className="relative z-10 flex items-center justify-between py-3 lg:px-8 border-b border-stone-200">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="font-serif text-2xl font-bold text-stone-950">
                          The Throne
                        </span>
                    </Link>
                </div>

                {/* Mobile menu button (Hamburger) */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-stone-600 hover:text-stone-950"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex lg:gap-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`pb-1 text-sm font-medium transition-colors ${
                                link.active
                                    ? 'border-b-2 border-amber-800 text-stone-950'
                                    : 'text-stone-700 hover:text-stone-950 hover:border-b-2 hover:border-amber-800/50'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center">
                    <form role="search" className="w-full max-w-xs">
                        <label htmlFor="desktop-search" className="sr-only">Search posts</label>
                        <div className="relative">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
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
            </header>

            {/* Main Hero Content */}
            <div className="relative z-10 mx-auto max-w-9xl py-24 sm:py-32 lg:py-48 px-6 sm:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl text-center">
                    {/* Main Heading (Strong Serif) */}
                    <h1 className="font-serif text-6xl font-extrabold leading-tight tracking-tight text-stone-950 sm:text-7xl lg:text-8xl">
                        Welcome to Ryuzora&rsquo;s digital garden.
                    </h1>
                    {/* Descriptive Text (Sans-Serif/Smaller Serif) */}
                    <p className="mt-8 text-lg font-medium text-stone-700 sm:text-xl/9 leading-relaxed max-w-3xl mx-auto">
                        Koleksi tulisan, pemikiran, opini, dan review dari orang yang bukan siapa-siapa
                    </p>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-stone-50 p-6 sm:max-w-sm sm:ring-1 sm:ring-stone-100/10">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="-m-1.5 p-1.5">
                <span className="font-serif text-3xl font-bold text-stone-950">
                  The Memoir
                </span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-stone-600 hover:text-stone-950"
                            >
                                <span className="sr-only">Close menu</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-stone-200">
                                <div className="space-y-2 py-6">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <Link href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950">
                                        Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

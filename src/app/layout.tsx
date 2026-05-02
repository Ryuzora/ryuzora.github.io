import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import SiteNavbar from "@/components/site-navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Throne",
  description: "Ryuzora's Personal Blogspot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-neutral)] text-[var(--color-text)]">
        <Suspense fallback={<div className="h-18" aria-hidden="true" />}>
          <SiteNavbar />
          <div className="h-18" aria-hidden="true" />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

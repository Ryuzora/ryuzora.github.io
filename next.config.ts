import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Tells Next.js to build a static HTML folder instead of a server app
  output: 'export',

  // 2. Disables the Next.js image server (required for GitHub Pages)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

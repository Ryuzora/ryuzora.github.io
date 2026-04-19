import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

export type PostType = 'Review' | 'Opinion' | 'Project';

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  type: PostType;
  category: string;
  tags: string[];
  excerpt: string;
  thumbnail: string;
}

export interface Post extends PostSummary {
  content: string;
}

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function readDate(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  return '';
}

function readPostType(value: unknown, fallback: PostType = 'Opinion'): PostType {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'review') return 'Review';
  if (normalized === 'opinion') return 'Opinion';
  if (normalized === 'project') return 'Project';
  return fallback;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function getMarkdownFilesRecursively(directory: string): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFilesRecursively(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  });
}

function readPostFile(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    realSlug,
    content,
    data,
  };
}

function toPostSummary(slug: string, data: Record<string, unknown>): PostSummary {
  const type = readPostType(data.type, 'Opinion');

  return {
    slug,
    title: readString(data.title, 'Untitled post'),
    date: readDate(data.date),
    type,
    category: readString(data.category),
    tags: readStringArray(data.tags),
    excerpt: readString(data.excerpt),
    thumbnail: readString(data.thumbnail),
  };
}

export function getPostBySlug(slug: string): Post {
  const { realSlug, data, content } = readPostFile(slug);
  return {
    ...toPostSummary(realSlug, data as Record<string, unknown>),
    content: content,
  };
}

export function getAllPosts(): PostSummary[] {
  const slugs = getMarkdownFilesRecursively(postsDirectory).map((filePath) =>
    path
      .relative(postsDirectory, filePath)
      .replace(/\\/g, '/')
      .replace(/\.md$/, '')
  );

  const posts = slugs
    .map((slug) => {
      const { realSlug, data } = readPostFile(slug);
      return toPostSummary(realSlug, data as Record<string, unknown>);
    })
    .sort((post1, post2) => {
      const post1Date = new Date(post1.date).getTime();
      const post2Date = new Date(post2.date).getTime();
      return post2Date - post1Date;
    });

  return posts;
}
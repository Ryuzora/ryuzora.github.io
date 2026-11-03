import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

// Drafts are visible (with a label) while running `npm run dev`,
// and left out entirely from the production build.
const SHOW_DRAFTS = process.env.NODE_ENV === 'development';

const WORDS_PER_MINUTE = 200;

export type PostType = 'Review' | 'Opinion' | 'Ranking';

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  type: PostType;
  category: string;
  tags: string[];
  excerpt: string;
  thumbnail: string;
  draft: boolean;
  readingTime: number;
}

export interface Post extends PostSummary {
  content: string;
}

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() || fallback : fallback;
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
  if (normalized === 'ranking') return 'Ranking';
  return fallback;
}

// A post is a draft only when frontmatter explicitly says `draft: true`.
// Missing, `false`, or any other value means the post is published.
function isDraft(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
  return false;
}

// Tags are cleaned up so "#oasis", "Oasis" and "oasis" all count as the same tag.
function readTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const tags = value
    .filter((item): item is string => typeof item === 'string')
    .map((tag) => tag.trim().replace(/^#+/, '').toLowerCase())
    .filter(Boolean);
  return Array.from(new Set(tags));
}

function getReadingTime(content: string): number {
  const words = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function getMarkdownFilesRecursively(directory: string): string[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    if (entry.name.startsWith('.')) return [];

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
    data: data as Record<string, unknown>,
  };
}

function toPostSummary(slug: string, data: Record<string, unknown>, content: string): PostSummary {
  return {
    slug,
    title: readString(data.title, 'Untitled post'),
    date: readDate(data.date),
    type: readPostType(data.type, 'Opinion'),
    category: readString(data.category),
    tags: readTags(data.tags),
    excerpt: readString(data.excerpt),
    thumbnail: readString(data.thumbnail),
    draft: isDraft(data.draft),
    readingTime: getReadingTime(content),
  };
}

export function getPostBySlug(slug: string): Post {
  const { realSlug, data, content } = readPostFile(slug);
  return {
    ...toPostSummary(realSlug, data, content),
    content,
  };
}

export function getAllPosts(): PostSummary[] {
  const slugs = getMarkdownFilesRecursively(postsDirectory).map((filePath) =>
    path
      .relative(postsDirectory, filePath)
      .replace(/\\/g, '/')
      .replace(/\.md$/, '')
  );

  return slugs
    .map((slug) => {
      const { realSlug, data, content } = readPostFile(slug);
      return toPostSummary(realSlug, data, content);
    })
    .filter((post) => SHOW_DRAFTS || !post.draft)
    .sort((post1, post2) => new Date(post2.date).getTime() - new Date(post1.date).getTime());
}

/** Newer and older neighbours of a post, in date order. */
export function getAdjacentPosts(slug: string): { newer: PostSummary | null; older: PostSummary | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { newer: null, older: null };

  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

/**
 * Posts most similar to the given one: same category counts most,
 * then shared tags, then same type. Ties go to the newer post.
 */
export function getRelatedPosts(slug: string, limit = 3): PostSummary[] {
  const posts = getAllPosts();
  const current = posts.find((post) => post.slug === slug);
  if (!current) return [];

  const category = current.category.toLowerCase();

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      let score = 0;
      if (category && post.category.toLowerCase() === category) score += 3;
      score += post.tags.filter((tag) => current.tags.includes(tag)).length;
      if (post.type === current.type) score += 1;
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

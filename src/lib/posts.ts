import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { Post, PostMeta, PostFrontmatter } from "@/types/post";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getAllPostMetas(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  const metas: PostMeta[] = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      frontmatter: data as PostFrontmatter,
    };
  });

  return metas.sort((a, b) => {
    const dateDiff =
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    // 같은 날짜: 파일명의 HHMM 시간으로 2차 정렬 (내림차순)
    // 패턴: 2026-02-18-1932-slug.md → 인덱스 11~14가 HHMM
    const timeA = parseInt(a.slug.slice(11, 15)) || 0;
    const timeB = parseInt(b.slug.slice(11, 15)) || 0;
    return timeB - timeA;
  });
}

export function getPostMetasByCategory(category: string): PostMeta[] {
  return getAllPostMetas().filter((p) => p.frontmatter.category === category);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content: rawContent } = matter(fileContents);

  const processed = await remark().use(html, { sanitize: false }).process(rawContent);
  const content = processed.toString();

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

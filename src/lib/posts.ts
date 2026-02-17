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

  return metas.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
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

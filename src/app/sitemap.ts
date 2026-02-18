import type { MetadataRoute } from "next";
import { getAllPostMetas } from "@/lib/posts";
import { categories } from "@/lib/categories";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://saju-blog-automation.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostMetas();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.filter((cat) => cat.slug !== "all").map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryEntries,
    ...postEntries,
  ];
}

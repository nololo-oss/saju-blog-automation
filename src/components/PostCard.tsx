import Link from "next/link";
import type { PostMeta } from "@/types/post";
import CategoryBadge from "./CategoryBadge";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group py-5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border">
      <Link href={`/posts/${post.slug}`} className="block">
        <CategoryBadge category={post.frontmatter.category} />
        <h3
          className="mt-1.5 text-[15px] font-medium leading-snug text-foreground transition-colors group-hover:text-muted"
        >
          {post.frontmatter.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {post.frontmatter.description}
        </p>
        <time className="mt-1.5 block text-[11px] text-accent-light">
          {post.frontmatter.date}
        </time>
      </Link>
    </article>
  );
}

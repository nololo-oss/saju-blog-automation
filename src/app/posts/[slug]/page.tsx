import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import CategoryBadge from "@/components/CategoryBadge";
import CTABanner from "@/components/CTABanner";

export const revalidate = 60; // 1분마다 재검증

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return []; // SSR로 전환하여 실시간 파일 읽기 허용
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      locale: "ko_KR",
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <header className="mb-8">
        <CategoryBadge category={post.frontmatter.category} />
        <h1
          className="mt-2 text-xl font-bold leading-snug text-foreground md:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {post.frontmatter.title}
        </h1>
        <p className="mt-2 text-[13px] text-muted">{post.frontmatter.description}</p>
        <div className="mt-2 flex items-center gap-3">
          <time className="text-[11px] text-accent-light">
            {post.frontmatter.date}
          </time>
          {post.frontmatter.tags && (
            <div className="flex flex-wrap gap-1.5">
              {post.frontmatter.tags.map((tag) => (
                <span key={tag} className="text-[11px] text-accent-light">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {post.frontmatter.thumbnail && (
          <div className="mt-6">
            <img
              src={post.frontmatter.thumbnail}
              alt={post.frontmatter.title}
              className="w-full rounded"
            />
          </div>
        )}
        <div className="mt-6 border-b border-border" />
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <CTABanner />
    </article>
  );
}

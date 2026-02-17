import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostMetasByCategory } from "@/lib/posts";
import { categories, getCategoryBySlug } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import CTABanner from "@/components/CTABanner";

export const revalidate = 60; // 1분마다 재검증

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return []; // SSR로 전환하여 실시간 파일 읽기 허용
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};

  return {
    title: `${cat.name}(${cat.hanja})`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const posts = getPostMetasByCategory(category);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="mb-8">
        <h1
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {cat.name}
          <span className="ml-1.5 text-sm font-normal text-accent-light">
            ({cat.hanja})
          </span>
        </h1>
        <p className="mt-1 text-[13px] text-muted">{cat.description}</p>
        <div className="mt-4 border-b border-border" />
      </header>

      <CTABanner />

      {posts.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-muted">
          이 카테고리에는 아직 글이 없습니다.
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPostMetas, getPostMetasByCategory } from "@/lib/posts";
import { categories, getCategoryBySlug } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import CTABanner from "@/components/CTABanner";

export const revalidate = 60; // 1분마다 재검증

const POSTS_PER_PAGE = 10;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
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

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const allPosts =
    category === "all"
      ? getAllPostMetas()
      : getPostMetasByCategory(category);

  const currentPage = Math.max(1, parseInt(pageParam || "1") || 1);
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const posts = allPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-1">
          {page > 1 && (
            <Link
              href={`/category/${category}?page=${page - 1}`}
              className="rounded px-3 py-1.5 text-[13px] text-muted transition-colors hover:bg-accent-bg hover:text-foreground"
            >
              이전
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/category/${category}?page=${p}`}
              className={`rounded px-3 py-1.5 text-[13px] transition-colors ${
                p === page
                  ? "bg-foreground text-card-bg font-medium"
                  : "text-muted hover:bg-accent-bg hover:text-foreground"
              }`}
            >
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link
              href={`/category/${category}?page=${page + 1}`}
              className="rounded px-3 py-1.5 text-[13px] text-muted transition-colors hover:bg-accent-bg hover:text-foreground"
            >
              다음
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

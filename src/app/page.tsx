import Link from "next/link";
import { getAllPostMetas } from "@/lib/posts";
import { categories } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import CTABanner from "@/components/CTABanner";

export const revalidate = 60; // 1분마다 재검증

export default function Home() {
  const posts = getAllPostMetas();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      {/* 히어로 */}
      <section className="mb-10 text-center">
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          명운관
        </h1>
        <p className="mt-1 text-xs text-accent-light">明運館</p>
        <p className="mt-3 text-[13px] text-muted">
          사주 · 관상 · 꿈해몽 · 풍수 · 궁합 · 작명 · 오늘의 운세
        </p>
      </section>

      {/* 카테고리 */}
      <section className="mb-10">
        <div className="grid grid-cols-7 border-y border-border">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center py-4 text-center transition-colors hover:bg-accent-bg"
            >
              <span className="text-[13px] text-foreground">{cat.name}</span>
              <span className="mt-0.5 text-[10px] text-accent-light">{cat.hanja}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CTABanner />

      {/* 최신 글 */}
      <section>
        <h2 className="mb-1 text-[13px] font-medium text-foreground">
          최신 글
        </h2>
        {posts.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-muted">
            아직 등록된 글이 없습니다.
          </p>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

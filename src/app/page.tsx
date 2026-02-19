import Link from "next/link";
import { getAllPostMetas } from "@/lib/posts";
import { categories } from "@/lib/categories";
import PostCard from "@/components/PostCard";
import CTABanner from "@/components/CTABanner";

export const revalidate = 60; // 1분마다 재검증

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "명운관",
  url: "https://destiny-center.com",
  description: "사주팔자, 관상, 꿈해몽, 풍수, 궁합, 작명, 오늘의 운세까지. 동양 철학으로 풀어보는 나의 운명 이야기.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://destiny-center.com/category/all?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  const allPosts = getAllPostMetas();
  const posts = allPosts.slice(0, 10);
  const displayCategories = categories.filter((c) => c.slug !== "all");

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
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
          {displayCategories.map((cat) => (
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
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[13px] font-medium text-foreground">
            최신 글
          </h2>
          <Link
            href="/category/all"
            className="text-[12px] text-muted transition-colors hover:text-foreground"
          >
            전체보기
          </Link>
        </div>
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

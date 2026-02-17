import Link from "next/link";

export default function CTABanner() {
  return (
    <div className="my-8 bg-accent-bg px-5 py-6 text-center">
      <p className="text-[15px] text-foreground">
        나의 사주가 궁금하다면?
      </p>
      <p className="mt-1 text-[13px] text-muted">
        전문 역학가의 사주 풀이를 만나보세요.
      </p>
      <Link
        href="https://destinycenter.co.kr/saju.html"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block border border-foreground/20 px-5 py-1.5 text-[13px] text-foreground transition-colors hover:bg-foreground hover:text-white"
      >
        사주 풀이 받기
      </Link>
    </div>
  );
}

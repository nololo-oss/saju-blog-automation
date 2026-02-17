import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Link
          href="https://destinycenter.co.kr/saju.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-foreground/20 px-5 py-2 text-[13px] text-foreground transition-colors hover:bg-foreground hover:text-white"
        >
          내 사주 풀이 받기
        </Link>
        <div className="mt-6 text-xs text-muted">
          &copy; {new Date().getFullYear()} 명운관(明運館)
        </div>
      </div>
    </footer>
  );
}

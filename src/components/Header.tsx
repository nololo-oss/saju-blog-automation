import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Header() {
  return (
    <header className="border-b border-border bg-card-bg">
      <div className="mx-auto max-w-3xl px-5 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-1.5">
            <span
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              명운관
            </span>
            <span className="text-xs text-muted">明運館</span>
          </Link>
          <nav className="hidden gap-5 md:flex">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "all" ? "/category/all" : `/category/${cat.slug}`}
                className="text-[13px] text-muted transition-colors hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="mt-2.5 flex flex-wrap gap-4 md:hidden">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === "all" ? "/category/all" : `/category/${cat.slug}`}
              className="text-xs text-muted transition-colors hover:text-foreground"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

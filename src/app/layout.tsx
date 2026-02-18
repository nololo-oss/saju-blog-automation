import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "명운관 | 사주 · 관상 · 꿈해몽 · 풍수 · 궁합 · 작명",
    template: "%s | 명운관",
  },
  description:
    "사주팔자, 관상, 꿈해몽, 풍수, 궁합, 작명, 오늘의 운세까지. 동양 철학으로 풀어보는 나의 운명 이야기.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "명운관",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

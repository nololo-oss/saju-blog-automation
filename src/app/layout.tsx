import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
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
    images: [
      {
        url: "https://destiny-center.com/api/og?title=%EB%AA%85%EC%9A%B4%EA%B4%80&desc=%EC%82%AC%EC%A3%BC%ED%8C%94%EC%9E%90%2C+%EA%B4%80%EC%83%81%2C+%EA%BF%88%ED%95%B4%EB%AA%BD%2C+%ED%92%8D%EC%88%98%2C+%EA%B6%81%ED%95%A9%2C+%EC%9E%91%EB%AA%85",
        width: 1200,
        height: 630,
        alt: "명운관",
      },
    ],
  },
  verification: {
    google: "fRJHr2XIyl6tsxS7MDQNH5W7QguKrRJy07ZX0aqECUA",
    other: {
      "naver-site-verification": "863ed77ccf1cdbd84d943aed1d2bb9ebb8b6aba0",
    },
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
        <Analytics />
      </body>
    </html>
  );
}

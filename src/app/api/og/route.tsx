import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "명운관";
  const desc =
    searchParams.get("desc") ??
    "사주팔자, 관상, 꿈해몽, 풍수, 궁합, 작명, 오늘의 운세";

  const fontSize = title.length > 22 ? 44 : title.length > 14 ? 52 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#fafaf8",
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 88px",
          position: "relative",
        }}
      >
        {/* 상단 장식선 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#1c1c1c",
          }}
        />

        {/* 사이트명 */}
        <div
          style={{
            color: "#777",
            fontSize: 24,
            marginBottom: 28,
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          明運館 · 명운관
        </div>

        {/* 제목 */}
        <div
          style={{
            fontSize,
            fontWeight: "bold",
            color: "#1c1c1c",
            lineHeight: 1.35,
            marginBottom: 28,
            display: "flex",
          }}
        >
          {title}
        </div>

        {/* 설명 */}
        <div
          style={{
            fontSize: 26,
            color: "#555",
            lineHeight: 1.6,
            display: "flex",
          }}
        >
          {desc.length > 60 ? desc.slice(0, 60) + "…" : desc}
        </div>

        {/* 도메인 */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 88,
            fontSize: 20,
            color: "#bbb",
            display: "flex",
          }}
        >
          destiny-center.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

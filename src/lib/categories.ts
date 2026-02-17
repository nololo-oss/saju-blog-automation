export interface CategoryMeta {
  slug: string;
  name: string;
  hanja: string;
  description: string;
  color: string;
}

export const categories: CategoryMeta[] = [
  {
    slug: "saju",
    name: "사주",
    hanja: "四柱",
    description: "사주팔자로 알아보는 나의 운명과 적성",
    color: "bg-[#4a4a4a]",
  },
  {
    slug: "gwansang",
    name: "관상",
    hanja: "觀相",
    description: "얼굴에 담긴 운명의 비밀을 풀어봅니다",
    color: "bg-[#4a4a4a]",
  },
  {
    slug: "dream",
    name: "꿈해몽",
    hanja: "解夢",
    description: "꿈 속 상징이 전하는 메시지를 해석합니다",
    color: "bg-[#4a4a4a]",
  },
  {
    slug: "fengshui",
    name: "풍수",
    hanja: "風水",
    description: "공간의 기운을 읽고 행운을 부르는 풍수 비법",
    color: "bg-[#4a4a4a]",
  },
  {
    slug: "daily",
    name: "오늘의운세",
    hanja: "運勢",
    description: "매일 업데이트되는 띠별 운세",
    color: "bg-[#4a4a4a]",
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}

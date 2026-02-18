# 명운관(明運館) 블로그 - Claude Code 가이드

## 프로젝트 개요
- **이름**: 명운관(明運館)
- **주제**: 사주, 관상, 꿈해몽, 풍수, 궁합, 작명, 오늘의 운세
- **스택**: Next.js 16 + TypeScript + Tailwind CSS v4
- **배포**: Vercel (CLI 수동 배포, GitHub 자동 연동 아님)
- **URL**: https://saju-blog-automation.vercel.app

## 블로그 포스팅 프로세스 (필수 준수)

블로그에 글을 올릴 때 반드시 아래 3단계를 모두 수행해야 합니다:

### 1단계: 마크다운 파일 작성
- 경로: `content/posts/` 디렉토리에 `.md` 파일 생성
- 파일명: `슬러그-형식.md` (예: `2026-saju-basics-guide.md`)
- 프론트매터 형식:
```yaml
---
title: "글 제목"
description: "SEO용 설명 (1~2문장)"
date: "YYYY-MM-DD"
category: "saju" | "gwansang" | "dream" | "fengshui" | "gunghap" | "jakming" | "daily"
tags: ["태그1", "태그2"]
---
```

### 2단계: Git 커밋 & 푸시
```bash
cd /home/nohhe/saju-blog
git add content/posts/새파일.md
git commit -m "feat(content): 글 제목 요약"
git push
```

### 3단계: Vercel 배포 (필수!)
> **중요**: GitHub 푸시만으로는 블로그에 반영되지 않습니다!
> Vercel-GitHub 자동 연동이 설정되어 있지 않으므로, 반드시 CLI로 배포해야 합니다.

```bash
cd /home/nohhe/saju-blog
npx vercel --prod --yes
```

또는 배포 스크립트 사용:
```bash
./scripts/deploy.sh
```

### 프로세스 요약
```
글 작성 → git add & commit & push → npx vercel --prod --yes
```
이 3단계를 빠짐없이 수행해야 블로그에 게시글이 반영됩니다.

## 디자인 가이드

### 폰트
- 제목: Nanum Myeongjo (명조체)
- 본문: Noto Sans KR

### 색상
- 무채색 중심의 깔끔한 팔레트
- 배경: `#fafaf8`, 텍스트: `#1c1c1c`, 보조: `#777`

### 한자 사용 규칙
- 한자는 한글의 보조/디자인 요소로만 사용
- 형식: `한글(漢字)` (예: 사주(四柱), 관상(觀相))
- 한자를 단독으로 사용하지 않음

### 이모지
- 사용하지 않거나 최소한으로 사용

## 카테고리
| slug | 이름 | 한자 |
|------|------|------|
| saju | 사주 | 四柱 |
| gwansang | 관상 | 觀相 |
| dream | 꿈해몽 | 解夢 |
| fengshui | 풍수 | 風水 |
| gunghap | 궁합 | 宮合 |
| jakming | 작명 | 作名 |
| daily | 오늘의운세 | 運勢 |

## 주요 파일 경로
- 글 작성: `content/posts/*.md`
- 초안: `content/_drafts/*.md`
- 컴포넌트: `src/components/`
- 페이지: `src/app/`
- 카테고리 설정: `src/lib/categories.ts`
- 배포 스크립트: `scripts/deploy.sh`

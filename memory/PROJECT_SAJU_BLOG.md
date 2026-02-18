# 🔮 PROJECT: 운세/사주 블로그 자동화 (Technical Memory)

## 📅 프로젝트 개요
- **목적**: 운세/사주 서비스 홍보를 위한 블로그 자동 운영 시스템.
- **운영 방식**: OpenClaw(기획/Director) + Claude Code(개발/Operator) 협업.
- **상태**: Phase 1(배포) 완료 → Phase 2(구조/기능 구현) 완료 → **Phase 3(콘텐츠 자동화) 준비 완료**.

---

## 🏗️ 시스템 아키텍처 및 구현 스펙

### 1. 기술 스택 (Tech Stack)
- **Framework**: Next.js 16 + TypeScript
- **Styling**: Tailwind CSS v4 (Custom Theme: Dark Purple / `#0f0a1e`)
- **Deployment**: Vercel
- **Content Engine**: Markdown (remark + remark-html)
- **Fonts**: Noto Sans KR (본문), Noto Serif KR (제목)

### 2. 파일 구조 (File Structure)
- **Project Root**: `/home/nohhe/.openclaw/workspace/saju-blog/`
- **Draft Drop Zone**: `content/_drafts/` (**OpenClaw 기획안 투입 경로**)
- **Published Posts**: `content/posts/`
- **Scripts**: `scripts/process-drafts.sh`, `scripts/DRAFT_TEMPLATE.md`

---

## 📝 기획안 작성 규칙 (OpenClaw 수행 지침)

### 1. 파일 생성 규칙
- **저장 위치**: `/home/nohhe/.openclaw/workspace/saju-blog/content/_drafts/`
- **파일명 형식**: `slug-형태-제목.md` (영문 소문자, 하이픈 권장)
  - 예: `2026-dream-tiger-meaning.md`
  - 예: `2026-daily-february-zodiac.md`
- **확장자**: 반드시 `.md` 사용.
- **주의**: `content/posts/`에 같은 파일명이 존재하면 덮어씌워지므로 중복 주의.

### 2. Frontmatter 필수 항목
```yaml
---
title: "포스트 제목"
description: "SEO용 설명 (150자 이내)"
date: "2026-02-14"
category: "saju"
tags: ["태그1", "태그2"]
---
```
**Category 값 (7종 중 택 1):**
- `saju` (사주)
- `gwansang` (관상)
- `dream` (꿈해몽)
- `fengshui` (풍수)
- `gunghap` (궁합)
- `jakming` (작명)
- `daily` (오늘의운세)

### 3. 본문 작성 가이드
- **형식**: Markdown (##, ### 소제목 적극 활용하여 구조화).
- **분량**: 최소 800자 이상 권장 (SEO 점수 확보).
- **CTA**: 배너는 시스템에서 자동 삽입되므로 본문에 직접 넣지 않음.
- **홍보**: 자연스러운 유입을 위해 본문 말미에 *"전문가의 정확한 사주 풀이가 궁금하다면?"* 같은 문구 추가 가능.

---

## 🚀 배포 프로세스 (Deployment)

**OpenClaw가 `_drafts/`에 파일을 생성한 후, 다음 중 하나를 실행:**

### 방법 A (수동 요청)
- 클로드코드에게 **"드래프트 발행해줘"**라고 요청하거나,
- 터미널에서 `npm run publish-drafts` 실행 지시.

### 방법 B (자동 감시 모드)
- 백그라운드에서 `npm run watch-drafts` 실행 시 5분 간격으로 `_drafts/` 감시 → 자동 배포.
- **전제 조건**: Git push 권한이 설정된 환경이어야 함.

---

## ✅ 구현 및 검증 체크리스트
- [x] Phase 1: Next.js + Tailwind 프로젝트 생성 및 Vercel 배포.
- [x] Phase 2: 카테고리, 포스트 시스템, UI, SEO 구축.
- [ ] **Phase 3**: OpenClaw가 첫 번째 기획안(Markdown) 생성 테스트.
- [ ] **Phase 3**: 클로드코드가 기획안을 감지하여 자동 배포(Git Push) 성공 확인.
- [ ] **Phase 3**: Vercel 배포 후 실제 라이브 URL에서 글 확인.

---
*마지막 업데이트: 2026-02-13 (Phase 3 운영 매뉴얼 통합)*

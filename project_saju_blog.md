# 🔮 사주/운세 블로그 프로젝트 (Saju Blog Project)

## 📌 프로젝트 개요
- **목표:** 사주, 운세, 풍수 인테리어 등을 주제로 하는 블로그 운영 및 수익화.
- **플랫폼:** Vercel (Next.js/Gatsby 기반 정적 사이트)
- **주요 기능:**
    - AI 기반 운세 콘텐츠 생성 (Gemini Pro)
    - 썸네일/이미지 자동 생성 (Nano Banana Pro)
    - **자동 배포 파이프라인 (GitHub + Vercel)**

## 🛠️ 자동 포스팅 가이드 (2026-02-14 업데이트)

**[중요] 클로드코드(Claude Code) 협업 프로토콜 준수**

### 1. 포스팅 작성 규칙
- **이미지 경로:** `public/images/posts/` 폴더에 저장.
- **Frontmatter 필수:**
    ```yaml
    thumbnail: "/images/posts/파일명.png"
    ```
- **본문 작성 주의사항:**
    - 본문에 `![](...)` 이미지 태그를 **절대 넣지 말 것**.
    - 이유: 썸네일이 헤더에 자동으로 표시되도록 코드가 수정되었으므로, 본문에 넣으면 중복 출력됨.

### 2. 배포 프로세스 (3단계 필수)
**단순 `git push`만으로는 사이트에 반영되지 않음!**

1.  **콘텐츠 생성:** `content/posts/`에 마크다운 파일 생성 + `public/images/posts/`에 이미지 저장.
2.  **Git 업로드:** `git add .` → `git commit -m "Add new post"` → `git push`
3.  **Vercel 배포 (핵심):**
    - **반드시** 다음 명령어를 실행해야 함:
    - `npx vercel --prod --yes`
    - (또는 클로드코드에게 배포 요청)

---

## 📝 히스토리 및 이슈 해결
- **2026-02-14:**
    - **문제:** 포스팅이 git push까지만 되고 Vercel 배포 누락, 이미지 미표시 현상 발생.
    - **원인:** GitHub-Vercel 자동 연동 미설정, remark-html sanitize 설정이 <img> 태그 제거.
    - **해결:**
        - 포스트 상세 페이지 코드 수정 (frontmatter thumbnail 자동 렌더링).
        - remark-html sanitize 설정 수정 완료.
        - 배포 절차에 `npx vercel --prod --yes` 명시적 추가.

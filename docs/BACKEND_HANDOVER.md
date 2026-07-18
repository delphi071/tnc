# 백엔드 인수인계 — 개발환경 안내 & 구축 방법

한국의길과문화 웹사이트(프론트엔드) 인수인계 문서입니다.
**대상 운영 환경: AWS + Apache + PHP**

> 최종 갱신: 2026-07-19 (커밋 `975cf16` 기준)
> 이 시점에 "알리는 이야기"에 **활동현황·자료실** 게시판이 추가되어 게시판이 3종이 되었습니다.
> 연동해야 할 API 도 그만큼 늘었으니 [5. API 계약](#5-api-계약)과 [6. 연동 포인트](#6-백엔드-연동-포인트-현재-하드코딩--api-교체-위치)를 함께 보세요.

---

## 1. 한눈에 보는 구조

이 프론트엔드는 **Next.js(React/TypeScript)** 로 만들어졌습니다. **Apache/PHP 에서 직접 실행되지 않습니다.**
브라우저가 받는 HTML/CSS/JS 는 소스(`src/`)를 빌드해 **자동 생성**되는 결과물입니다.

운영 아키텍처는 아래와 같이 **정적 프론트 + PHP API** 로 분리합니다.

```
[브라우저]
   │  ① 정적 페이지 요청
   ▼
[Apache]  ── DocumentRoot = Next 정적 빌드(out/)  → HTML/CSS/JS 서빙
   │  ② fetch('/api/...') (JSON)
   ▼
[PHP]     ── /api/* 를 PHP 가 처리  →  [MySQL/RDS 등]
```

- **프론트**: `npm run build` 결과물 `out/`(순수 HTML/CSS/JS)을 Apache DocumentRoot 에 업로드
- **백엔드(PHP)**: `/api/...` JSON 엔드포인트 제공 (아래 [5. API 계약](#5-api-계약) 참고)
- 둘은 **fetch 로만 통신** — 프론트에 PHP 코드 없음, 백엔드에 React 코드 없음

> ⚠️ 프론트 화면/데이터가 바뀌면 **소스 수정 → 재빌드 → 새 `out/` 교체** 사이클이 필요합니다.
> PHP API 작업만 하는 동안엔 `out/` + 본 문서의 API 계약만 있으면 됩니다.

---

## 2. 기술 스택 / 요구 버전

| 항목 | 버전 | 비고 |
|---|---|---|
| Node.js | **22.x** (LTS) | 빌드/개발 실행에 필요 |
| Next.js | **16.2.9** | ⚠️ 최신 버전이라 기존 Next 와 API·관례가 다름 |
| React | 19.2.4 | |
| TypeScript | 5.x | |
| Tailwind CSS | 4.x | PostCSS 플러그인(`@tailwindcss/postcss`) |
| 패키지 매니저 | npm (`package-lock.json` 기준) | |

> ⚠️ **Next 16 주의**: 라우팅·설정·파일 규칙이 이전 버전과 다릅니다. 작업 전 공식 16 문서 또는 `node_modules/next/dist/docs` 를 먼저 확인하세요. (레포 `AGENTS.md` 에도 명시)

---

## 3. 개발환경 구축 방법 (로컬)

### 3-1. 사전 준비
- Node.js 22.x 설치 ([nodejs.org](https://nodejs.org) 또는 nvm)
- Git

### 3-2. 설치 & 실행
```bash
# 1) 소스 클론 (또는 전달받은 zip 압축 해제)
git clone <repo-url> koreanroad
cd koreanroad

# 2) 의존성 설치
npm install

# 3) 개발 서버 실행 (http://localhost:3000)
npm run dev
```

### 3-3. 주요 스크립트 (`package.json`)
| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (핫 리로드, http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 → 정적 export 시 `out/` 생성 |
| `npm start` | (Node 서버 모드로 실행할 때만) 빌드 결과 서빙 |
| `npm run lint` | ESLint 검사 |

### 3-4. 폴더 구조
```
src/
  app/            # 라우트/페이지 (App Router). 각 폴더 = URL 경로
    our-stories/notices/[id]/      # 공지사항 상세(동적 라우트)
    our-stories/activities/[id]/   # 활동현황 상세(동적 라우트)
    our-stories/archives/[id]/     # 자료실 상세(동적 라우트)
  components/     # 화면 컴포넌트 (PC/모바일)
    BoardPanels.tsx   # 활동현황(갤러리형)·자료실(게시판형) 패널
    NoticeDetail.tsx  # 게시글 상세 — 세 게시판이 공유(backHash 로 목록 복귀 위치만 구분)
  i18n/           # 다국어(한/영) 사전 · 로케일
public/           # 정적 에셋 (이미지/아이콘/GIF)
docs/             # 문서(본 문서 포함)
next.config.ts    # Next 설정
```

---

## 4. 정적 빌드(`out/`) 만들기 — Apache 배포용

Apache 에 올리려면 **정적 export** 로 빌드해야 합니다.

### 4-1. `next.config.ts` 설정 (정적 export)
> 현재 레포는 기본(서버) 모드입니다. Apache 배포 시 아래로 변경하세요.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",            // out/ 으로 순수 정적 파일 생성
  images: { unoptimized: true }, // Apache 엔 Node 이미지 최적화기가 없으므로 필수
  trailingSlash: true,         // 폴더/index.html 매칭에 유리
};

export default nextConfig;
```

### 4-2. 빌드
```bash
npm ci
npm run build
# → 프로젝트 루트에 out/ 폴더 생성 (HTML/CSS/JS/이미지)
```

### 4-3. Apache 배포
- `out/` 의 내용을 **DocumentRoot** 에 업로드
- `/api` 경로만 PHP 로 처리 (같은 도메인이면 CORS 불필요)
- 정적 라우트는 각 페이지가 `폴더/index.html` 로 생성되어 그대로 매칭됨

### 4-4. ⚠️ 정적 export 시 반드시 처리해야 할 것
1. **이미지 최적화 비활성화** — `images.unoptimized: true` (위 설정에 포함)
2. **동적 라우트 `[id]` 3개** — 정적 export 는 빌드 시점에 모든 id 를 알아야 함.
   DB 에서 동적으로 오는 글은 빌드 때 알 수 없으므로 **상세 페이지를 "브라우저에서 id 읽어 PHP API fetch"** 방식으로 바꿔야 함.
   대상: `/our-stories/notices/[id]`, `/our-stories/activities/[id]`, `/our-stories/archives/[id]`
   - 권장: 쿼리 방식 `/our-stories/notice?id=123` 단일 페이지 → JS 가 `?id` 읽어 `GET /api/notices/123`
   - 또는 Apache rewrite 로 `/notices/123` → 셸 페이지로 넘기고 클라이언트 fetch
   - 세 상세 화면은 `NoticeDetail.tsx` 하나를 공유하므로, 한 번만 바꾸면 셋 다 적용됨
3. **폼 연동** — 소식받기/문의하기 submit → `POST /api/subscribe`, `POST /api/inquiry`
4. **검색·페이지네이션이 아직 표시 전용** — 게시판 3종 모두 검색창과 페이지 번호(01~05)가
   화면에만 있고 동작하지 않음. API 붙일 때 상태·핸들러를 함께 구현해야 함.

---

## 5. API 계약 (PHP 가 구현할 JSON 엔드포인트)

> 같은 도메인이면 `/api` 로, 다른 도메인이면 `NEXT_PUBLIC_API_BASE_URL` 로 베이스 URL 주입.
> 아래는 초안 — 실제 필드는 협의 후 확정.

"알리는 이야기"는 게시판이 **3종**입니다. 화면 형태만 다르고 구조는 같습니다.

| 게시판 | 탭(한/영) | 목록 형태 | 목록에 필요한 필드 |
|---|---|---|---|
| 공지사항 | 공지사항 / Notices | 썸네일 + 제목 + 본문 2줄 + 날짜 | `title, body, date` |
| 활동현황 | 활동현황 / Activities | 3열 갤러리(썸네일 + 제목 + 날짜) | `title, date, thumbnail` |
| 자료실 | 자료실 / Archives | 날짜 + 제목 한 줄 | `title, date` |

| 메서드 | 경로 | 용도 | 요청 | 응답(JSON) |
|---|---|---|---|---|
| GET | `/api/notices?page={n}&q={검색어}` | 공지 목록 | - | `{ items: [{id,title,body,date}], total, page }` |
| GET | `/api/notices/{id}` | 공지 상세 | - | `{ id, title, body, date, poster?, prevId?, nextId? }` |
| GET | `/api/activities?page={n}&q={검색어}` | 활동현황 목록 | - | `{ items: [{id,title,date,thumbnail}], total, page }` |
| GET | `/api/activities/{id}` | 활동현황 상세 | - | 공지 상세와 동일 스키마 |
| GET | `/api/archives?page={n}&q={검색어}` | 자료실 목록 | - | `{ items: [{id,title,date}], total, page }` |
| GET | `/api/archives/{id}` | 자료실 상세 | - | 공지 상세와 동일 스키마 |
| GET | `/api/annual?page={n}` | 연간기금·활동실적 내역 | - | `{ items: [{date,title}], total, page }` |
| POST | `/api/subscribe` | 소식받기 신청 | `{ name, phone, email, interests }` | `{ ok: true }` |
| POST | `/api/inquiry` | 문의하기 | `{ name, email, content }` | `{ ok: true }` |

> 상세 3종은 프론트에서 `NoticeDetail.tsx` 하나를 공유하므로 **응답 스키마를 동일하게** 맞춰 주세요.
> 활동현황 목록의 `thumbnail` 은 현재 로고 플레이스홀더가 들어가 있습니다(실제 이미지 없음).

---

## 6. 백엔드 연동 포인트 (현재 하드코딩 → API 교체 위치)

현재는 API 가 없고 샘플 데이터가 컴포넌트에 하드코딩되어 있습니다. 아래 위치를 fetch 로 교체하면 됩니다.

> PC 와 모바일이 **별도 컴포넌트**라, 목록 데이터는 두 곳을 같이 고쳐야 합니다.
> (`NoticesSection.tsx` = PC, `OurStoriesMobile.tsx` = 모바일. 개수·데이터는 현재 동일하게 맞춰 둠)

| 기능 | 파일 | 현재 상태 |
|---|---|---|
| 공지 목록 | `NoticesSection.tsx` · `OurStoriesMobile.tsx` | 샘플 5개 고정 |
| 활동현황 목록 | `NoticesSection.tsx` · `OurStoriesMobile.tsx` (패널은 `BoardPanels.tsx` 의 `GalleryPanel`) | 샘플 9개 고정, 썸네일은 로고 플레이스홀더 |
| 자료실 목록 | `NoticesSection.tsx` · `OurStoriesMobile.tsx` (패널은 `BoardPanels.tsx` 의 `ListPanel`) | 샘플 10개 고정 |
| 게시글 상세 (3종 공용) | `NoticeDetail.tsx` · 라우트 `src/app/our-stories/{notices,activities,archives}/[id]` | 샘플 고정, `params.id` 미사용 |
| 검색 / 페이지네이션 | `BoardPanels.tsx` · `NoticesSection.tsx` · `OurStoriesMobile.tsx` | 표시만 되고 동작 안 함 |
| 소식받기 구독 | `SubscribeSection.tsx` · 모바일 `OurStoriesMobile.tsx` | submit 이 `preventDefault` 만 함 |
| 문의하기 | `InquirySection.tsx` | 동상 |
| 연간기금 내역 | `WalkWithUsContent.tsx`(`AnnualBody`) · 모바일 `WalkWithUsMobile.tsx` | 샘플 10개 고정 |
| 완보 인증 탭 | `i18n/dictionaries.ts`(`koriaDulegil.tabs` 마지막, `blocks: []`) · `KoriaDulegilSection.tsx`(`{ src: undefined }`) | 탭만 있고 내용 비어 있음(자료 대기) |

---

## 7. 환경변수

- 비밀키/설정은 코드에 넣지 말고 환경변수로 주입합니다.
- 정적 export 에서 브라우저로 노출돼야 하는 값은 **`NEXT_PUBLIC_` 접두사**가 필요합니다(빌드 시점에 박힘).

| 변수 | 용도 | 예시 |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | PHP API 베이스 URL | `/api` (같은 도메인) 또는 `https://api.example.com` |

> ⚠️ 정적 export 는 빌드 시점에 `NEXT_PUBLIC_*` 값이 결과물에 포함됩니다. 값이 바뀌면 **재빌드** 필요.

---

## 8. 전달물 체크리스트

**포함**
- `src/`, `public/`, `docs/`
- `package.json`, `package-lock.json`
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`
- (Apache 배포물) `npm run build` 결과 `out/`

**제외**
- `node_modules/` (→ `npm install` 복원)
- `.next/`, `out/`(소스로 줄 땐 제외, 배포물로 따로 전달)
- `.vercel/`, `.env*`(비밀키)

> 깔끔하게 소스만 묶기: `git archive --format=zip --output=handover.zip HEAD`
> (`.gitignore` 를 따라 node_modules·.next·.env 자동 제외)

---

## 9. 참고

- Vercel(현재 `tnc-cyan.vercel.app`)은 **확인용 미리보기**입니다. 실제 운영은 AWS Apache + PHP.
- 다국어(한/영) 구조는 `src/i18n/` — 쿠키 기반 토글, 사전은 `dictionaries.ts`.
  화면 문구는 대부분 여기 있고, 컴포넌트에는 거의 없습니다.
- 반응형: 데스크톱/모바일 컴포넌트가 분리(`*Mobile.tsx`)되어 있고 `lg` 기준으로 전환됩니다.
  **한쪽만 고치면 다른 쪽이 그대로 남습니다** — 목록·탭·메뉴는 항상 양쪽을 같이 확인하세요.
- 상단 메뉴·푸터 메뉴·모바일 햄버거 메뉴는 **같은 소스**를 씁니다:
  라벨은 `i18n/dictionaries.ts` 의 `footer.cols`, 링크는 `i18n/navLinks.ts` 의 `COL_SUB_HREFS`.
  두 배열은 인덱스로 짝지어지므로 **개수·순서가 어긋나면 링크가 밀립니다.**

### 이미지 교체 시 주의 (실제로 겪은 문제)

`public/` 의 이미지를 **파일명은 그대로 두고 내용만 교체하면**, Next 이미지 최적화 캐시(`.next/cache/images`)와
CDN 이 예전 이미지를 계속 서빙합니다. 화면에는 옛 이미지가 그대로 보이거나, 새 오버레이와 겹쳐 보입니다.

→ 이미지를 교체할 땐 **파일명을 바꾸세요**(`kdl-1.jpg` → `kdl-1-v2.jpg`, `cf-5.jpg` → `cf-5-v2.jpg`).
   참조 위치는 `KoriaDulegilSection.tsx` 같은 섹션 컴포넌트와 모바일의 `imgSrc` 오버라이드 두 곳입니다.

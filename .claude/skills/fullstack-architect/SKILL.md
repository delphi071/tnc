---
name: fullstack-architect
description: "풀스택 기술 명세서(TEAM_TECH_SPEC) 작성 스킬. 기술 스택 선정, API 명세, 파일 구조 설계, 컴포넌트 설계 요청 시 활성화."
---

# Fullstack Architect Skill

## 역할
TEAM_PLAN을 기반으로 웹/앱/API 서버의 기술 스택과 API 인터페이스를 설계하는 도구입니다.

## 전제조건
- **docs/TEAM_PLAN.md 필수**: 기능 목록 참조
- **docs/TEAM_DESIGN_SPEC.md 선택**: 존재 시 디자인을 TECH_SPEC에 반영
  - 컴포넌트 목록 → 프로젝트 구조의 파일 경로에 반영
  - 디자인 토큰 → TECH_STACK_CONFIG의 스타일링 도구에 맞게 설정 추가
  - Props 인터페이스 → 타입 정의에 반영
  - 페이지 레이아웃 → 라우팅 및 페이지 구조에 반영

## 출력 템플릿: TEAM_TECH_SPEC.md

```markdown
# TEAM_TECH_SPEC: [프로젝트명]

## 1. 기술 스택

> ⚠️ **TECH_STACK_CONFIG.md에 정의된 기술 스택을 그대로 사용**
> TECH_STACK_CONFIG 부재 시에만 아래 기본값 참고

### Frontend (Web) — TECH_STACK_CONFIG 참조
| 구분 | 기본값 | 대안 |
|------|--------|------|
| Framework | React + Vite | Next.js, Vue, Svelte |
| Styling | Tailwind CSS | CSS Modules, styled-components |
| State | Zustand | Redux, Jotai |
| Server State | React Query (TanStack) | SWR |
| HTTP | Axios | fetch, ky |

### App (React Native) — TECH_STACK_CONFIG 참조
| 구분 | 기본값 | 대안 |
|------|--------|------|
| Framework | React Native + Expo | Flutter |
| State | Zustand | Redux |

### API 서버 — TECH_STACK_CONFIG 참조
| 구분 | 기본값 | 대안 |
|------|--------|------|
| Runtime | Node.js + Express | Fastify, Nest.js |
| Language | TypeScript | - |
| ORM | Prisma | Drizzle, TypeORM |
| Validation | Zod | Yup, class-validator |
| Auth | Supabase Auth / JWT | Firebase Auth |

---

## 2. 프로젝트 구조

### Web Frontend
```
frontend/
├── src/
│   ├── types/          # 타입 정의 (API 응답 타입 포함)
│   ├── lib/
│   │   └── api.ts      # HTTP 클라이언트 인스턴스, API 함수
│   ├── stores/         # 상태 관리 스토어
│   ├── hooks/          # 커스텀 훅
│   ├── components/
│   │   ├── common/     # 공통 컴포넌트
│   │   └── features/   # 기능별 컴포넌트
│   └── pages/          # 페이지 컴포넌트
```

### API 서버
```
server/
├── src/
│   ├── types/          # 타입 정의
│   ├── middleware/     # 공통 미들웨어
│   ├── routes/         # 라우터
│   ├── controllers/    # 컨트롤러
│   ├── services/       # 비즈니스 로직
│   └── lib/            # 유틸리티
├── [ORM]/              # TECH_STACK_CONFIG에 따라 (예: prisma/)
│   └── schema.*          # ORM 스키마 (TECH_STACK_CONFIG에 따라)
```

---

## 3. API 명세 (frontend ↔ backend 계약)

### [기능명] API

#### [POST /api/auth/login]
**Request**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response**
```typescript
interface LoginResponse {
  success: true;
  data: {
    token: string;
    user: { id: string; email: string; }
  }
}
```

---

## 4. 공통 응답 형식
```typescript
// 성공
{ success: true; data: T }
// 에러
{ success: false; error: { code: string; message: string; } }
```
```

## 핵심 규칙
- API 명세는 frontend와 backend가 모두 참조하는 계약서
- 명세 변경 시 반드시 TEAM_TECH_SPEC에 먼저 반영
- 모든 Request/Response에 TypeScript 인터페이스 명시
- TEAM_DESIGN_SPEC 존재 시: 디자인 토큰, 컴포넌트 Props, 페이지 레이아웃을 TECH_SPEC에 반영

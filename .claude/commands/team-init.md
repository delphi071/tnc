---
name: team-init
description: "에이전트 팀 프로젝트 초기화. 팀 프로젝트 시작, 폴더 구조 생성 요청 시 사용."
category: team
complexity: basic
allowed-tools: [Bash, Write, Read]
---

# /team-init - 팀 프로젝트 초기화

## 동작
에이전트 팀 방식의 풀스택 프로젝트에 필요한 기본 구조를 생성합니다.

## 🔴 기존 파일 보호
- 이미 존재하는 파일/폴더는 절대 덮어쓰지 않습니다.

## 실행 순서

### Step 1: 현재 구조 확인
```bash
ls docs/ frontend/ server/ app/ 2>/dev/null
```

### Step 2: 폴더 구조 생성 (없는 것만)
```bash
[ ! -d docs ]     && mkdir -p docs
[ ! -d frontend ] && mkdir -p frontend
[ ! -d server ]   && mkdir -p server
# 앱 프로젝트 시: [ ! -d app ] && mkdir -p app
```

### Step 3: 기술 스택 설정 (TECH_STACK_CONFIG)

**`docs/TECH_STACK_CONFIG.md`가 없으면 사용자에게 기술 스택을 질문하고 생성한다.**

질문 항목:
1. **플랫폼**: Web / App (React Native+Expo) / 둘 다
2. **프론트엔드 프레임워크**: React+Vite / Next.js / Vue+Vite / 기타
3. **스타일링**: Tailwind CSS / CSS Modules / styled-components / Sass / 기타
4. **상태 관리**: Zustand / Redux / Jotai / React hooks / 기타
5. **HTTP 클라이언트**: Axios / fetch / ky / 기타
6. **서버 상태**: React Query (TanStack) / SWR / 없음
7. **백엔드 런타임**: Node.js+Express / Node.js+Fastify / Nest.js / Python+FastAPI / 기타
8. **ORM**: Prisma / Drizzle / TypeORM / Sequelize / 기타
9. **DB**: PostgreSQL (Supabase) / MySQL (PlanetScale) / MongoDB / SQLite / 기타
10. **인증**: Supabase Auth / Firebase Auth / JWT 직접 구현 / NextAuth / 기타
11. **입력 검증**: Zod / Yup / class-validator / 기타
12. **배포 플랫폼**: Frontend(Vercel/Netlify/AWS), Backend(Vercel Functions/AWS), DB(Supabase/PlanetScale/AWS RDS)

**이미 존재하면 스킵.**

### Step 4: 팀 문서 파일 생성 (없는 것만)
- `docs/TEAM_PLAN.md` - PM 작업 계획 템플릿
- `docs/TEAM_STATUS.md` - 팀 진행 상태
- `docs/TEAM_DESIGN_SPEC.md` - 디자인 명세 (designer 작성, 선택)
- `docs/TEAM_TECH_SPEC.md` - 기술 명세 (architect 작성)
- `docs/TEAM_DB_SCHEMA.md` - DB 스키마 (dba 작성)
- `docs/TEAM_QA_REPORT.md` - QA 리포트 (qa 작성)
- `docs/TEAM_TEST_REPORT.md` - 테스트 리포트 (tester 작성)
- `docs/TEAM_AUDIT_REPORT.md` - 감사 리포트 (auditor 작성)

## 생성 구조

```
[프로젝트명]/
├── docs/
│   ├── TECH_STACK_CONFIG.md  # → /team-init에서 작성
│   ├── TEAM_PLAN.md
│   ├── TEAM_STATUS.md
│   ├── TEAM_DESIGN_SPEC.md  # → /team-figma에서 작성 (선택)
│   ├── TEAM_TECH_SPEC.md
│   ├── TEAM_DB_SCHEMA.md
│   ├── TEAM_QA_REPORT.md
│   ├── TEAM_TEST_REPORT.md    # → /team-test에서 작성
│   └── TEAM_AUDIT_REPORT.md   # → /team-audit에서 작성
├── frontend/    ← @frontend 담당
├── server/      ← @backend + @dba 담당
└── app/         ← @frontend 담당 (앱 프로젝트 시)
```

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- 현재 Phase: Phase 0 (init)
- 상태: 🔄 진행중

Phase 완료 시 업데이트:
- Phase 0: ✅ 완료 + 완료 시각

`docs/TEAM_STATUS.md` 초기 템플릿도 생성 (없을 경우에만).

## 완료 메시지
```
✅ 팀 프로젝트 초기화 완료

📋 기술 스택: docs/TECH_STACK_CONFIG.md 작성 완료

다음 단계: /team-plan [프로젝트 아이디어] 로 PM에게 기획을 요청하세요.
⚡ 또는 /team-auto [아이디어] 로 전체 자동 실행
```

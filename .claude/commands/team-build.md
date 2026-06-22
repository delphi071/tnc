---
name: team-build
description: "@frontend + @backend + @dba를 병렬 실행하여 코드를 구현. 풀스택 구현, 병렬 개발 요청 시 사용. 전제조건: TEAM_TECH_SPEC + TEAM_DB_SCHEMA 필수."
category: team
complexity: enhanced
allowed-tools: [Read, Write, Edit, Bash]
---

# /team-build - 병렬 구현 (최대 3개 동시)

## 동작
@frontend, @backend, @dba를 **동시에** 실행하여 UI, API, DB를 병렬로 구현합니다.

## 사용법
```
/team-build
```

## 전제조건
- **docs/TEAM_TECH_SPEC.md 필수**
- **docs/TEAM_DB_SCHEMA.md 필수**
- **docs/TEAM_DESIGN_SPEC.md 선택**: 존재 시 디자인 토큰, 컴포넌트 스타일, 레이아웃 참조
- 필수 항목 없으면 → "/team-design을 먼저 실행하세요."

## ⚡ 병렬 실행 (최대 3개 동시)

```
설계 문서 확인 후 즉시 병렬 실행:

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ @frontend        │  │ @backend         │  │ @dba             │
│ - 타입 정의       │  │ - 프로젝트 초기화  │  │ - ORM 스키마     │
│ - API 클라이언트  │  │ - 미들웨어        │  │   파일 생성       │
│ - 컴포넌트        │  │ - 라우터/컨트롤러  │  │ - 초기 seed 데이터│
│ - 페이지          │  │ - 서비스 로직     │  │   (옵션)          │
│ (mock API 사용)  │  │ - ORM 연동       │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         ↓ 완료 후 통합 단계
  @pm: API 연동 교체 (mock → 실제) + 통합 확인
```

## 실행 순서

### Step 1: 전제조건 체크
```
TEAM_TECH_SPEC.md + TEAM_DB_SCHEMA.md 존재 확인
├── 존재 → Step 2
└── 미존재 → 안내 후 중단
```

### Step 2: 디자인 스펙 확인
```
docs/TEAM_DESIGN_SPEC.md 존재 확인
├── 존재 → "🎨 TEAM_DESIGN_SPEC 감지 → @frontend가 디자인 기반 구현"
└── 미존재 → 기본 UI로 진행
```

### Step 3: 3개 에이전트 동시 활성화
- @frontend → `frontend/src/` 구현 (mock API 사용, DESIGN_SPEC 참조 시 디자인 기반)
- @backend → `server/src/` 구현
- @dba → ORM 스키마 파일 생성 (TECH_STACK_CONFIG에 따라)

### Step 4: 통합 (PM 조율)
모두 완료 후:
- frontend의 mock API → 실제 backend API로 교체
- 연동 확인 (타입 일치 여부)

### Step 5: TEAM_STATUS 업데이트

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- 현재 Phase: Phase 3 (build)
- @frontend: 🔄 진행중
- @backend: 🔄 진행중
- @dba: 🔄 진행중

각 에이전트 완료 시 개별 업데이트:
- @frontend: ✅ 완료 + 완료 시각
- @backend: ✅ 완료 + 완료 시각
- @dba: ✅ 완료 + 완료 시각

Phase 완료 시:
- Phase 3: ✅ 완료 + 완료 시각

## 출력물
- `frontend/src/` 전체 코드
- `server/src/` 전체 코드
- ORM 스키마 파일 (TECH_STACK_CONFIG에 따라)

## 완료 메시지
```
✅ 병렬 구현 완료

📁 구현 결과
- @frontend: 컴포넌트 N개, 페이지 N개
- @backend: API N개, 서비스 N개
- @dba: 테이블 N개 스키마 생성

🔗 통합 상태: API 연동 교체 완료

다음 단계: /team-review 로 통합 검증을 시작하세요.
```

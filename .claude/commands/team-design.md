---
name: team-design
description: "@architect + @dba를 병렬 실행하여 기술 명세와 DB 스키마를 동시에 설계. 기술 설계, API 설계, DB 설계 요청 시 사용. 전제조건: TEAM_PLAN.md 필수."
category: team
complexity: enhanced
allowed-tools: [Read, Write, Edit]
---

# /team-design - 병렬 설계 (2개 동시)

## 동작
@architect와 @dba를 **동시에** 실행하여 기술 명세와 DB 스키마를 병렬로 설계합니다.

## 사용법
```
/team-design
```

## 전제조건
- **docs/TEAM_PLAN.md 필수**: 팀 계획 참조
- **docs/TEAM_DESIGN_SPEC.md 선택**: 존재 시 디자인을 TECH_SPEC에 반영
- 없으면 → "/team-plan을 먼저 실행하세요."

## ⚡ 병렬 실행 (2개 동시)

```
TEAM_PLAN 확인 후 즉시 병렬 실행:

┌─────────────────────┐  ┌──────────────────────┐
│ @architect          │  │ @dba                 │
│ - 기술 스택 선정     │  │ - 엔티티 분석         │
│ - 파일 구조 설계     │  │ - ERD 설계            │
│ - API 명세 작성     │  │ - ORM 스키마 작성     │
│ → TEAM_TECH_SPEC   │  │ → TEAM_DB_SCHEMA     │
└─────────────────────┘  └──────────────────────┘
         ↓ 완료 후 조율 단계
  @pm: API ↔ DB 정합성 확인
```

## 실행 순서

### Step 1: 전제조건 체크
```
TEAM_PLAN.md 존재 확인
├── 존재 → Step 2
└── 미존재 → 안내 후 중단
```

### Step 2: 디자인 스펙 확인
```
docs/TEAM_DESIGN_SPEC.md 존재 확인
├── 존재 → "🎨 TEAM_DESIGN_SPEC 감지 → TECH_SPEC에 반영합니다."
└── 미존재 → 디자인 없이 진행
```

### Step 3: 병렬 실행 시작
@architect와 @dba를 **동시에** 활성화:
- @architect → `docs/TEAM_TECH_SPEC.md` 작성 (DESIGN_SPEC 참조, 존재 시)
- @dba → `docs/TEAM_DB_SCHEMA.md` 작성

### Step 4: 조율 (PM)
두 에이전트 완료 후 @pm이 확인:
- API 명세의 데이터 구조 ↔ DB 스키마 정합성
- 불일치 시 해당 에이전트에 수정 요청

### Step 5: TEAM_STATUS 업데이트
```
@architect: ✅ 완료
@dba: ✅ 완료
```

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- 현재 Phase: Phase 2 (design)
- @architect: 🔄 진행중
- @dba: 🔄 진행중

각 에이전트 완료 시 개별 업데이트:
- @architect: ✅ 완료 + 완료 시각
- @dba: ✅ 완료 + 완료 시각

Phase 완료 시:
- Phase 2: ✅ 완료 + 완료 시각

## 출력물
- `docs/TEAM_TECH_SPEC.md`
- `docs/TEAM_DB_SCHEMA.md`

## 완료 메시지
```
✅ 병렬 설계 완료

📐 설계 결과
- TEAM_TECH_SPEC: API N개, 파일 구조 확정
- TEAM_DB_SCHEMA: 테이블 N개, 관계 N개

다음 단계: /team-build 로 병렬 구현을 시작하세요.
```

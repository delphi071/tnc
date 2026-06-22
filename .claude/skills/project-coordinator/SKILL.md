---
name: project-coordinator
description: "팀 프로젝트 조율 스킬. 요구사항 분석, 팀 작업 계획 수립, 병렬 실행 설계, 결과 통합 요청 시 활성화."
---

# Project Coordinator Skill

## 역할
팀 전체의 작업을 조율하고, 병렬 실행 계획을 수립하며, 결과를 통합하는 도구입니다.

## 핵심 문서: TEAM_PLAN.md

```markdown
# TEAM_PLAN: [프로젝트명]

## 프로젝트 개요
- 플랫폼: [Web / App / Both]
- API 서버: [필요 / 불필요]
- DB: [TECH_STACK_CONFIG 참조]
- 인증: [필요 / 불필요]

## 기능 목록
1. [기능 1]
2. [기능 2]
3. [기능 3]

## 팀 역할 배분
| 역할 | 담당 기능 | 담당 파일 범위 |
|------|---------|------------|
| @architect | API 설계, 기술 스택 | docs/TEAM_TECH_SPEC.md |
| @dba | DB 스키마 설계 | docs/TEAM_DB_SCHEMA.md |
| @frontend | UI 구현 | frontend/src/ |
| @backend | API 서버 구현 | server/src/ |
| @qa | 통합 검증 | docs/TEAM_QA_REPORT.md |

## 병렬 실행 계획

### Phase 1 - 설계 (동시 실행 2개)
- @architect: TEAM_TECH_SPEC 작성
- @dba: TEAM_DB_SCHEMA 작성

### Phase 2 - 구현 (동시 실행 3개)
전제: Phase 1 완료 후
- @frontend: UI 구현 (API mock 사용)
- @backend: API 서버 구현
- @dba: ORM 스키마 파일 생성 (TECH_STACK_CONFIG의 ORM에 따라)

### Phase 3 - 검증 (순차)
- @qa: 통합 검증

## 의존성 규칙
- Phase 2는 TEAM_TECH_SPEC + TEAM_DB_SCHEMA 완료 후 시작
- @qa는 frontend + backend 모두 완료 후 시작
```

## TEAM_STATUS.md 자동 관리

@pm은 TEAM_STATUS.md를 다음 시점에 업데이트합니다:

### 업데이트 시점
1. 각 Phase 시작 시 → 상태를 🔄 진행중으로 변경
2. 각 에이전트 완료 시 → 해당 에이전트를 ✅ 완료로 변경
3. 각 Phase 완료 시 → Phase를 ✅ 완료로 변경 + 완료 시각 기록
4. 수동 확인 항목 발생 시 → "수동 확인 필요 항목" 섹션에 추가
5. 오류/실패 발생 시 → 상태를 ❌ 실패로 변경 + 사유 기록

### TEAM_STATUS.md 형식
```markdown
# TEAM_STATUS

## 현재 상태
- 마지막 실행: {timestamp}
- 현재 Phase: {phase name}
- 중단 지점: {detail}

## Phase별 상태
| Phase | 상태 | 완료 시각 | 비고 |
|-------|------|----------|------|
| 0 init | ⏳/🔄/✅ | | |
| 1 plan | ⏳/🔄/✅ | | |
| 1.5 figma | ⏳/🔄/✅/⏭️ | | |
| 2 design | ⏳/🔄/✅ | | @architect: ✅, @dba: ✅ |
| 3 build | ⏳/🔄/✅ | | @frontend: ✅, @backend: 🔄, @dba: ✅ |
| 4 review | ⏳/🔄/✅ | | PASS/FAIL |
| 5 test+audit | ⏳/🔄/✅ | | @tester: ✅, @auditor: 🔄 |
| 6 deploy | ⏳/🔄/✅ | | staging/production URL |
| 7 monitor | ⏳/🔄/✅ | | |

## 수동 확인 필요 항목
- [ ] {item}

## 사용자 메모
(자유 기입)
```

### 세션 복구 시
새 세션에서 /team-auto 실행 시:
1. TEAM_STATUS.md를 먼저 읽음
2. 마지막 진행 상태 파악
3. 중단된 Phase부터 재개
4. 수동 확인 필요 항목이 있으면 사용자에게 먼저 표시

## 의존성 충돌 방지 규칙
- 각 에이전트는 자신의 파일 범위에만 작성
- API 인터페이스 변경 시 반드시 TEAM_TECH_SPEC 먼저 수정 후 frontend/backend 양쪽에 반영
- DB 스키마 변경 시 TEAM_DB_SCHEMA 먼저 수정 후 backend에 반영

---
name: team-test
description: "@tester 에이전트를 호출하여 풀스택 테스트 코드 작성 및 실행. 테스트, 단위 테스트, E2E, 커버리지 요청 시 사용. 전제조건: TEAM_TECH_SPEC + frontend/src + server/src 필수."
category: team
complexity: enhanced
allowed-tools: [Read, Write, Edit, Bash]
---

# /team-test - 풀스택 테스트 작성 및 실행

## 동작
@tester 에이전트를 호출하여 frontend와 backend 각각의 테스트 코드를 작성하고 실행합니다.

## 사용법
```
/team-test
```

## 전제조건
- **docs/TEAM_PLAN.md 필수**: 기능 요구사항 참조
- **docs/TEAM_TECH_SPEC.md 필수**: API 명세, 함수명 참조
- **frontend/src/ 필수**: 프론트엔드 테스트 대상
- **server/src/ 필수**: 백엔드 테스트 대상
- **docs/TEAM_QA_REPORT.md 권장**: QA 통과 상태 확인

## 실행 순서

### Step 1: 전제조건 체크
```
TEAM_TECH_SPEC + frontend/src + server/src 존재 확인
├── 모두 존재 → Step 2
└── 미존재 → 해당 단계 안내 후 중단
```

### Step 2: @tester 에이전트 활성화
- test-writer 스킬 자동 활성화

### Step 3: 테스트 케이스 도출
- TEAM_PLAN 기능 → 테스트 시나리오 매핑
- TEAM_TECH_SPEC API 명세 → API 테스트 대상
- TEAM_TECH_SPEC 함수 목록 → 단위 테스트 대상

### Step 4: 테스트 코드 작성 (병렬 가능)

**Frontend 테스트**
1. 유틸/훅 단위 테스트 (`frontend/tests/unit/`)
2. 컴포넌트 테스트 (`frontend/tests/components/`)

**Backend 테스트**
1. 서비스 단위 테스트 (`server/tests/unit/`)
2. API 엔드포인트 테스트 (`server/tests/api/`)

**E2E 테스트**
1. 주요 사용자 시나리오 (`tests/e2e/`)

### Step 5: 테스트 실행 + 자동 수정 루프
```
Frontend 테스트 실행 (npm test --prefix frontend)
├── PASS → Backend 테스트로
└── FAIL → 원인 분석 → 수정 → 재실행 (최대 3회)

Backend 테스트 실행 (npm test --prefix server)
├── PASS → E2E 테스트로
└── FAIL → 원인 분석 → 수정 → 재실행 (최대 3회)

E2E 테스트 실행
├── PASS → Step 6
└── FAIL → 원인 분석 → 수정 → 재실행 (최대 3회)
    └── 3회 실패 시 → 수동 확인 항목으로 분류
```

### Step 6: 커버리지 확인
- 목표: Frontend 80%+, Backend 80%+
- 미달 시 추가 테스트 작성

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- 현재 Phase: Phase 5 (test+audit)
- @tester: 🔄 진행중

완료 시 업데이트:
- @tester: ✅ 완료 + 완료 시각 + 결과 (PASS/FAIL, 커버리지 %)
- 수동 확인 항목이 있으면 "수동 확인 필요 항목" 섹션에 추가

## 출력물
- `frontend/tests/` 내 테스트 파일
- `server/tests/` 내 테스트 파일
- `tests/e2e/` E2E 테스트 파일
- `docs/TEAM_TEST_REPORT.md`

## 완료 메시지

```
✅ 풀스택 테스트 완료

🧪 결과
| 영역 | PASS | FAIL | 커버리지 |
|------|------|------|---------|
| Frontend | N | N | N% |
| Backend | N | N | N% |
| E2E | N | N | - |

⚠️ 수동 확인 필요: N개
  1. [항목]

다음 단계:
  /team-audit 와 병렬 실행 중 → 두 단계 모두 완료 후 /team-deploy 진행
  개별 실행 시 → /team-audit 로 보안/품질 점검
```

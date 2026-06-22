---
name: team-review
description: "@qa 에이전트를 호출하여 통합 검증 수행. frontend-backend 연동 확인, 인터페이스 계약 검증, QA 리포트 요청 시 사용. 전제조건: frontend + backend 코드 필수."
category: team
complexity: enhanced
allowed-tools: [Read, Write, Bash, Glob, Grep]
---

# /team-review - 팀 통합 검증

## 동작
@qa 에이전트를 호출하여 병렬 개발된 frontend와 backend의 인터페이스 계약 일치 여부를 검증합니다.

## 사용법
```
/team-review
```

## 전제조건
- **frontend/src/ 필수**
- **server/src/ 필수**
- **docs/TEAM_TECH_SPEC.md 필수**
- **docs/TEAM_DB_SCHEMA.md 필수**
- **docs/TEAM_DESIGN_SPEC.md 선택**: 존재 시 디자인-코드 일치 검증 추가

## 실행 순서

### Step 1: 전제조건 체크

### Step 2: @qa 에이전트 활성화
- qa-engineer 스킬 자동 활성화

### Step 3: 3단계 검증

**인터페이스 계약 검증 (최우선)**
- API URL 일치
- Request/Response 타입 일치
- HTTP Method 일치
- 인증 헤더 처리 일치

**DB ↔ API 정합성**
- DB 스키마 필드 ↔ API Response 일치

**코드 품질**
- TypeScript 오류 (`npx tsc --noEmit`)
- ESLint 검사

**디자인-코드 일치 검증 (TEAM_DESIGN_SPEC 존재 시만)**
- 디자인 토큰 적용 여부 (하드코딩된 색상/폰트/간격 감지)
- 컴포넌트 Props 인터페이스 일치
- 상태 완전성 (hover, disabled, loading, error, empty)
- 레이아웃/반응형 일치
- 에셋 경로 일치

### Step 4: 판정
- ✅ PASS → /team-test + /team-audit 진행 (Phase 5)
- ❌ FAIL → 해당 에이전트에 수정 요청 + 재검증

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- 현재 Phase: Phase 4 (review)
- 상태: 🔄 진행중

Phase 완료 시 업데이트:
- Phase 4: ✅ 완료 + 완료 시각 + 판정 결과 (PASS/FAIL)
- FAIL 시: 재검증 횟수 기록
- 수동 확인 항목이 있으면 "수동 확인 필요 항목" 섹션에 추가

## 출력물
- `docs/TEAM_QA_REPORT.md`

## 완료 메시지 (PASS)
```
✅ 통합 검증 PASS

📊 결과
- 인터페이스 계약: ✅ N/N
- DB ↔ API 정합성: ✅ N/N
- 코드 품질: ✅
- 🎨 디자인 일치: ✅ N/N / ⏭️ 스킵

다음 단계: /team-test + /team-audit 로 테스트 및 보안 점검을 시작하세요. (또는 /team-auto 로 자동 진행)
```

## 완료 메시지 (FAIL)
```
❌ 통합 검증 FAIL

불일치 항목:
  [@frontend / @backend]: [수정 내용]

수정 후 /team-review 를 다시 실행하세요.
```

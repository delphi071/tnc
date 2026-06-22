---
name: team-audit
description: "@auditor 에이전트를 호출하여 풀스택 보안/품질 점검 수행. 보안 감사, 취약점 검사, 코드 품질, 의존성 점검 요청 시 사용. 전제조건: frontend/src + server/src 필수."
category: team
complexity: enhanced
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# /team-audit - 풀스택 보안/품질 점검

## 동작
@auditor 에이전트를 호출하여 frontend와 backend 각각의 보안 취약점, 코드 품질, 의존성 리스크를 점검합니다.

## 사용법
```
/team-audit
```

## 전제조건
- **frontend/src/ 필수**: 프론트엔드 감사 대상
- **server/src/ 필수**: 백엔드 감사 대상
- **frontend/package.json + server/package.json 필수**: 의존성 확인
- **docs/TEAM_TEST_REPORT.md 권장**: 테스트 완료 상태 확인

## 실행 순서

### Step 1: 전제조건 체크
```
frontend/src + server/src + package.json 존재 확인
├── 존재 → Step 2
└── 미존재 → 안내 후 중단
```

### Step 2: @auditor 에이전트 활성화
- security-auditor 스킬 자동 활성화

### Step 3: Frontend 점검
**보안 (OWASP 기반)**
- XSS, 민감 데이터 노출, 환경변수 사용

**코드 품질**
```bash
cd frontend && npx tsc --noEmit
cd frontend && npx eslint src/ --format=json
```

**의존성**
```bash
cd frontend && npm audit --audit-level=high
```

### Step 4: Backend 점검
**보안 (OWASP 기반)**
- Injection, 인증/인가, CORS, Rate Limiting, 입력 검증

**코드 품질**
```bash
cd server && npx tsc --noEmit
cd server && npx eslint src/ --format=json
```

**의존성**
```bash
cd server && npm audit --audit-level=high
```

### Step 5: 발견 사항 분류
- 🔴 CRITICAL/🟠 HIGH → 자동 수정 시도 → 불가 시 수동 확인 항목
- 🟡 MEDIUM → 가능하면 자동 수정
- 🟢 LOW → 리스트업만

### Step 6: 리포트 생성
- `docs/TEAM_AUDIT_REPORT.md` 작성

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- @auditor: 🔄 진행중

완료 시 업데이트:
- @auditor: ✅ 완료 + 완료 시각 + 결과 (CRITICAL/HIGH 개수)
- Phase 5 전체 완료 시: Phase 5: ✅ 완료
- 수동 확인 항목이 있으면 "수동 확인 필요 항목" 섹션에 추가

## 출력물
- `docs/TEAM_AUDIT_REPORT.md`

## 완료 메시지

```
✅ 풀스택 보안/품질 점검 완료

🔍 결과
| 영역 | 🔴 | 🟠 | 🟡 | 🟢 |
|------|-----|-----|-----|-----|
| Frontend | N | N | N | N |
| Backend | N | N | N | N |
| 의존성 | N | N | N | N |

배포 가능: ✅ / ❌ (CRITICAL/HIGH 해결 필요)

⚠️ 수동 확인 필요:
  1. [항목] - [이유]

다음 단계: /team-deploy 로 배포를 시작하세요.
```

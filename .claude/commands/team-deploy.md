---
name: team-deploy
description: "팀 프로젝트를 배포. frontend + backend 분리 배포, 환경변수 설정, 배포 요청 시 사용. 전제조건: TEAM_QA_REPORT PASS 필수."
category: team
complexity: enhanced
allowed-tools: [Read, Write, Bash]
---

# /team-deploy - 풀스택 배포

## 동작
QA 검증이 완료된 frontend와 backend를 각각 적합한 플랫폼에 배포합니다.

## 사용법
```
/team-deploy
```

## 전제조건 (엄격)
- **docs/TEAM_QA_REPORT.md 필수**: PASS 판정 확인
- **docs/TEAM_TEST_REPORT.md 필수**: 테스트 PASS 확인
- **docs/TEAM_AUDIT_REPORT.md 필수**: CRITICAL/HIGH 미해결 없음 확인
- 하나라도 FAIL 상태에서 배포 시도 시 **즉시 중단**

## 배포 대상별 플랫폼

| 대상 | 권장 플랫폼 | 명령 |
|------|-----------|------|
| Frontend (Web) | TECH_STACK_CONFIG 참조 | 플랫폼별 상이 |
| Backend (API) | TECH_STACK_CONFIG 참조 | 플랫폼별 상이 |
| DB | TECH_STACK_CONFIG 참조 | 클라우드 관리형 |
| App (RN) | TECH_STACK_CONFIG 참조 | 플랫폼별 상이 |

## 실행 순서

### Step 1: QA + 테스트 + 감사 PASS 확인
- TEAM_QA_REPORT: PASS 확인
- TEAM_TEST_REPORT: PASS 확인
- TEAM_AUDIT_REPORT: CRITICAL/HIGH 미해결 없음 확인

### Step 2: 환경변수 검증
- frontend의 API URL 환경변수 확인 (TECH_STACK_CONFIG에 따라)
- backend의 DB 연결 및 인증 시크릿 환경변수 확인

### Step 3: 빌드 검증
```bash
# Frontend
cd frontend && npm run build

# Backend
cd server && npm run build
```

### Step 4: Staging 배포 (순차, frontend → backend)
```bash
# Frontend → TECH_STACK_CONFIG에 정의된 플랫폼으로 staging 배포
cd frontend && [배포 명령]

# Backend → TECH_STACK_CONFIG에 정의된 플랫폼으로 staging 배포
cd server && [배포 명령]
```

### Step 5: 통합 Staging 테스트
- **실제 API 연동 확인** (mock 아닌 실제 backend)
- **→ 사용자에게 staging URL 전달, 확인 요청**

### Step 6: Production 배포 (사용자 승인 후)

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- 현재 Phase: Phase 6 (deploy)
- 상태: 🔄 진행중

staging 배포 후 업데이트:
- Phase 6: 🔄 staging 배포 완료, 사용자 확인 대기
- staging URL 기록

production 배포 후 업데이트:
- Phase 6: ✅ 완료 + 완료 시각
- production URL 기록

## 완료 메시지
```
✅ 풀스택 배포 완료

🌐 Frontend: https://[url]
🔧 Backend API: https://[url]
🗄 DB: [DB URL]

⚠️ 수동 확인 필요: N개

다음 단계: /team-monitor 로 모니터링 설정을 시작하세요.
```

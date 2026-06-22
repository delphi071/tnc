---
name: team-monitor
description: "풀스택 프로덕션 배포 후 모니터링 설정 수행. 에러 추적, 로그 설정, 알림 설정, 운영 모니터링 요청 시 사용. 전제조건: 배포 완료 필수."
category: team
complexity: basic
allowed-tools: [Read, Write, Edit]
---

# /team-monitor - 풀스택 모니터링 설정

## 동작
프로덕션 배포 후 frontend와 backend 각각의 에러 추적, 로그, 알림 시스템을 설정합니다.

## 사용법
```
/team-monitor
```

## 전제조건
- **배포 완료 상태**: frontend + backend 모두 배포된 상태
- 미완료 시 → "/team-deploy를 먼저 실행해주세요." 안내

## 실행 순서

### Step 1: 전제조건 체크
```
배포 상태 확인 (배포 URL 존재 여부)
├── 배포 완료 → Step 2
└── 미배포 → 안내 후 중단
```

### Step 2: Frontend 모니터링 설정

**에러 추적 (TECH_STACK_CONFIG의 모니터링 도구, 기본 권장: Sentry)**
- 에러 추적 도구 설치 및 초기화 코드 추가
- 소스맵 업로드 설정
- 에러 경계(Error Boundary) 설정

**성능 모니터링**
- Core Web Vitals 추적 (LCP, FID, CLS)
- 페이지 로드 시간 측정

**로그 설정**
- 프로덕션 로그 레벨 설정 (error/warn만)
- console.log 프로덕션 차단 확인

### Step 3: Backend 모니터링 설정

**에러 추적**
- 에러 추적 도구 설치 및 미들웨어 추가
- 처리되지 않은 에러 캡처
- API 에러율 추적

**성능 모니터링**
- API 응답 시간 로깅
- DB 쿼리 성능 추적
- 메모리/CPU 사용량 기본 로깅

**로그 설정**
- 구조화된 로깅 (winston / pino 등)
- 로그 레벨 분리 (error/warn/info/debug)
- 요청/응답 로깅 미들웨어

### Step 4: 알림 설정 (권장)
- 에러율 임계값 초과 시 알림
- API 응답시간 임계값 초과 시 알림
- 배포 성공/실패 알림

### Step 5: 설정 코드 적용
- `frontend/src/lib/monitoring.ts` - 프론트엔드 모니터링 초기화
- `server/src/lib/monitoring.ts` - 백엔드 모니터링 초기화
- 각 앱 진입점에 초기화 코드 추가

### Step 6: 모니터링 상태 확인
- 테스트 에러 발생 → 에러 추적 도구 수신 확인
- 배포 URL 최종 확인

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- 현재 Phase: Phase 7 (monitor)
- 상태: 🔄 진행중

Phase 완료 시 업데이트:
- Phase 7: ✅ 완료 + 완료 시각
- 전체 파이프라인: 🎉 완료

## 출력물
- `frontend/src/lib/monitoring.ts` - 프론트엔드 모니터링 코드
- `server/src/lib/monitoring.ts` - 백엔드 모니터링 코드
- 모니터링 설정 가이드 (콘솔 출력)

## 완료 메시지

```
✅ 풀스택 모니터링 설정 완료

📊 설정된 항목
| 영역 | 에러 추적 | 성능 | 로그 |
|------|---------|------|------|
| Frontend | ✅ | ✅ Core Web Vitals | ✅ |
| Backend | ✅ | ✅ API 응답시간 | ✅ |

🎉 전체 팀 프로젝트 사이클 완료!

📋 최종 수동 확인 목록:
  1. [항목]

📂 생성된 리포트:
  - docs/TEAM_PLAN.md
  - docs/TEAM_TECH_SPEC.md
  - docs/TEAM_DB_SCHEMA.md
  - docs/TEAM_QA_REPORT.md
  - docs/TEAM_TEST_REPORT.md
  - docs/TEAM_AUDIT_REPORT.md
```

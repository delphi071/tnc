---
name: security-auditor
description: "풀스택 보안 취약점과 코드 품질을 감사하는 스킬. 보안 점검, OWASP, 취약점 분석, 의존성 감사, frontend/backend 분리 점검 요청 시 활성화."
---

# Security Auditor Skill (Team)

## 역할
배포 전 frontend와 backend 각각의 보안 취약점, 코드 품질, 의존성 리스크를 체계적으로 점검하는 도구입니다.

## 점검 체크리스트

### 🔴 Frontend 보안 (CRITICAL/HIGH → 배포 차단)

#### XSS (Cross-Site Scripting)
- [ ] `dangerouslySetInnerHTML` 미사용 또는 sanitize 적용
- [ ] 사용자 입력값 HTML 이스케이프 처리
- [ ] CSP 헤더 설정

#### 민감 데이터 노출
- [ ] 소스코드에 API 키/비밀번호 하드코딩 없음
- [ ] 환경변수 올바른 사용 (PUBLIC/VITE_ 접두사 구분)
- [ ] console.log에 민감 정보 출력 없음
- [ ] 인증 토큰 저장 방식 안전성 확인

---

### 🔴 Backend 보안 (CRITICAL/HIGH → 배포 차단)

#### 인증/인가
- [ ] 모든 보호 API 라우트에 인증 미들웨어 적용
- [ ] 권한 없는 리소스 접근 차단
- [ ] 토큰 만료 처리 및 갱신 로직
- [ ] 비밀번호 해싱 (bcrypt/argon2)

#### 입력값 검증
- [ ] 서버사이드 입력값 유효성 검증 (TECH_STACK_CONFIG의 검증 도구)
- [ ] SQL/NoSQL Injection 방지 (파라미터화 쿼리 / ORM 사용)
- [ ] 파일 업로드 타입/크기 제한

#### CORS 및 헤더
- [ ] CORS origin 화이트리스트 설정
- [ ] 보안 헤더 (X-Frame-Options, HSTS, X-Content-Type-Options)
- [ ] Rate Limiting 적용

#### 환경변수
- [ ] .env 파일 git 커밋 없음 (.gitignore 확인)
- [ ] DB 연결 문자열 환경변수 처리
- [ ] 인증 시크릿 환경변수 처리

---

### 🟡 코드 품질 (MEDIUM → 가능하면 수정)

#### Frontend
- [ ] TypeScript `any` 타입 남용 없음
- [ ] `tsc --noEmit` 오류 없음
- [ ] ESLint 오류 없음
- [ ] 미사용 import/변수 없음
- [ ] console.log 디버깅 코드 없음

#### Backend
- [ ] TypeScript `any` 타입 남용 없음
- [ ] `tsc --noEmit` 오류 없음
- [ ] 모든 async 함수 적절한 에러 처리
- [ ] 처리되지 않은 Promise rejection 없음
- [ ] 에러 응답에 내부 정보 미노출

---

### 🔵 의존성 점검

```bash
# Frontend
cd frontend && npm audit --audit-level=high

# Backend
cd server && npm audit --audit-level=high
```

| 위험도 | 처리 방법 |
|--------|---------|
| CRITICAL | 즉시 업데이트 또는 대체 패키지 |
| HIGH | 배포 전 해결 |
| MODERATE | 리스트업 후 다음 버전에서 해결 |
| LOW | 기록만 |

---

## 감사 리포트 형식

```markdown
# TEAM_AUDIT_REPORT

> 감사 일시: [날짜]

## 종합 결과

| 영역 | 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | 🟢 LOW |
|------|-----------|--------|----------|-------|
| Frontend 보안 | N | N | N | N |
| Backend 보안 | N | N | N | N |
| Frontend 품질 | N | N | N | N |
| Backend 품질 | N | N | N | N |
| Frontend 의존성 | N | N | N | N |
| Backend 의존성 | N | N | N | N |
| **합계** | **N** | **N** | **N** | **N** |

**배포 가능 여부: ✅ 가능 / ❌ 불가 (CRITICAL/HIGH 해결 필요)**

## 발견 사항 상세

### 🔴 CRITICAL
#### [항목명]
- **위치**: [frontend/backend] - [파일 경로]
- **설명**: [취약점 설명]
- **자동 수정**: ✅ 완료 / ❌ 수동 확인 필요
- **개선 방안**: [구체적 조치]

### 🟠 HIGH
[동일 구조]

## 수동 확인 필요 항목
1. [항목] - [이유]
```

## 주의사항
- CRITICAL/HIGH 미해결 시 배포 진행 불가
- frontend/backend 각각 독립적으로 점검
- 자동 수정 후 반드시 재검증
- 보안 정책 결정이 필요한 항목은 사용자에게 명확히 질문

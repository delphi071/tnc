---
name: qa-engineer
description: "팀 빌드 결과물의 통합 검증 스킬. frontend-backend 인터페이스 계약 검증, API 연동 테스트, 통합 QA 리포트 작성 요청 시 활성화."
---

# QA Engineer Skill

## 역할
병렬로 개발된 frontend, backend, DB 결과물이 실제로 연동되는지 검증하는 도구입니다. 인터페이스 계약 일치 여부가 핵심입니다.

## 검증 체크리스트

### 🔴 인터페이스 계약 검증 (최우선)

| 항목 | frontend | backend | 일치 |
|------|---------|---------|------|
| API URL | 호출 경로 | 라우터 경로 | ✅/❌ |
| Request 타입 | 전송 필드 | 파싱 스키마 | ✅/❌ |
| Response 타입 | 사용 필드 | 반환 구조 | ✅/❌ |
| HTTP Method | 사용 메서드 | 라우터 메서드 | ✅/❌ |
| 인증 헤더 | Token 전송 | 미들웨어 검증 | ✅/❌ |

### 🟡 DB ↔ API 정합성

| 항목 | DB 스키마 | API Response | 일치 |
|------|-------------|-------------|------|
| 필드명 | camelCase | camelCase | ✅/❌ |
| 타입 | String/Int/.. | string/number/.. | ✅/❌ |
| 관계 데이터 | include 여부 | Response 포함 | ✅/❌ |

### 🟠 디자인-코드 일치 (TEAM_DESIGN_SPEC 존재 시만)

| 항목 | DESIGN_SPEC | 실제 코드 | 일치 |
|------|-----------|----------|------|
| 디자인 토큰 적용 | 토큰명 | CSS/스타일링 도구 | ✅/❌ |
| 컴포넌트 Props | 인터페이스 | 구현 Props | ✅/❌ |
| 상태 완전성 | 정의된 상태 | 구현 상태 | ✅/❌ |
| 레이아웃 | Flex/Grid | CSS | ✅/❌ |
| 반응형 | 브레이크포인트 | 미디어쿼리 | ✅/❌ |

### 🟢 코드 품질

| 항목 | Frontend | Backend |
|------|---------|---------|
| TypeScript 오류 | npx tsc | npx tsc |
| ESLint | npx eslint | npx eslint |
| 미처리 에러 | ✅/❌ | ✅/❌ |

---

## 통합 테스트 작성 형식

```typescript
// tests/integration/auth.test.ts
describe('인증 플로우', () => {
  it('회원가입 → 로그인 → 데이터 조회', async () => {
    // 1. 회원가입
    const signupRes = await api.post('/auth/signup', testUser);
    expect(signupRes.success).toBe(true);

    // 2. 로그인
    const loginRes = await api.post('/auth/login', testUser);
    expect(loginRes.data.token).toBeDefined();

    // 3. 인증된 요청
    const dataRes = await api.get('/profile', {
      headers: { Authorization: `Bearer ${loginRes.data.token}` }
    });
    expect(dataRes.data.email).toBe(testUser.email);
  });
});
```

---

## QA 리포트 형식

```markdown
# TEAM_QA_REPORT

> 검증 일시: [날짜]

## 종합 결과

| 영역 | 결과 | 점수 |
|------|------|------|
| 인터페이스 계약 | ✅/❌ | N/M |
| DB ↔ API 정합성 | ✅/❌ | N/M |
| 🎨 디자인 일치 | ✅/❌/⏭️ 스킵 | N/M |
| 코드 품질 | ✅/❌ | N/M |
| **종합** | ✅ PASS / ❌ FAIL | N% |

## 불일치 발견 항목

### [항목명]
- **frontend**: [실제 구현]
- **backend**: [실제 구현]
- **차이**: [무엇이 다른지]
- **수정 필요 에이전트**: [@frontend / @backend / 둘 다]
- **수정 방향**: [구체적 조치]

## 배포 가능 여부
✅ PASS - 배포 진행 가능
❌ FAIL - [수정 에이전트]에서 수정 후 재검증 필요
```

## 주의사항
- 인터페이스 불일치 발견 시 절대 임의 수정하지 않고 담당 에이전트에 수정 요청
- TECH_SPEC 기준으로만 판정 (스펙에 없는 항목으로 감점 금지)

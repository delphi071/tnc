---
name: test-writer
description: "풀스택 테스트 코드를 작성하는 스킬. frontend/backend 단위 테스트, API 통합 테스트, E2E 테스트, 커버리지 분석 요청 시 활성화."
---

# Test Writer Skill (Team)

## 역할
TEAM_PLAN의 기능 목록과 TEAM_TECH_SPEC의 API 명세를 기반으로 frontend와 backend 각각의 테스트 코드를 작성하는 도구입니다.

## 전제조건
- **docs/TEAM_PLAN.md 필수**: 기능 요구사항 → 테스트 시나리오 도출
- **docs/TEAM_TECH_SPEC.md 필수**: API 명세, 함수명 → 테스트 대상
- **frontend/src/ 및 server/src/ 필수**: 테스트할 코드 존재
- **docs/TECH_STACK_CONFIG.md 참조**: 테스트 도구 확인

## 테스트 계층

### 1. Frontend 단위 테스트
도구: TECH_STACK_CONFIG 참조 (기본: Vitest / Jest)

```typescript
// frontend/tests/unit/[functionName].test.ts
describe('functionName', () => {
  it('정상 동작: [기능 설명]', () => {
    const result = functionName(input);
    expect(result).toBe(expected);
  });

  it('엣지 케이스', () => {
    expect(() => functionName(null)).toThrow();
  });
});
```

### 2. Frontend 컴포넌트 테스트
```typescript
// frontend/tests/components/[Component].test.tsx
describe('ComponentName', () => {
  it('렌더링 확인', () => {
    render(<ComponentName {...props} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('사용자 인터랙션', async () => {
    render(<ComponentName />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('결과')).toBeVisible();
  });
});
```

### 3. Backend API 테스트
도구: TECH_STACK_CONFIG 참조 (기본: Jest + supertest)

```typescript
// server/tests/api/[endpoint].test.ts
describe('POST /api/auth/login', () => {
  it('성공: 유효한 자격증명', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('실패: 잘못된 비밀번호', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com',
      password: 'wrong',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
```

### 4. Backend 서비스 테스트
```typescript
// server/tests/services/[service].test.ts
describe('AuthService', () => {
  it('login: 유효한 사용자', async () => {
    const result = await AuthService.login({ email, password });
    expect(result.token).toBeDefined();
  });
});
```

### 5. E2E 테스트 (통합)
도구: TECH_STACK_CONFIG 참조 (기본: Playwright)

```typescript
// tests/e2e/[feature].spec.ts
test('회원가입 → 로그인 → 주요 기능', async ({ page }) => {
  // 1. 회원가입
  await page.goto('/signup');
  await page.fill('[name="email"]', 'test@test.com');
  await page.click('button[type="submit"]');

  // 2. 로그인
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@test.com');
  await page.click('button[type="submit"]');

  // 3. 주요 기능 확인
  await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
});
```

## 파일 구조
```
frontend/
├── tests/
│   ├── unit/          # 유틸/훅 단위 테스트
│   └── components/    # 컴포넌트 테스트
server/
├── tests/
│   ├── unit/          # 서비스 로직 단위 테스트
│   └── api/           # API 엔드포인트 테스트
tests/
└── e2e/               # E2E 테스트 (frontend + backend)
```

## 커버리지 목표
- Frontend 라인 커버리지: **80% 이상**
- Backend 라인 커버리지: **80% 이상**
- 핵심 비즈니스 로직: 100%

## 리포트 형식

```markdown
# TEAM_TEST_REPORT

> 테스트 일시: [날짜]

## 종합 결과

| 영역 | PASS | FAIL | 커버리지 |
|------|------|------|---------|
| Frontend 단위 | N | N | N% |
| Frontend 컴포넌트 | N | N | N% |
| Backend 단위 | N | N | N% |
| Backend API | N | N | N% |
| E2E | N | N | - |
| **종합** | **N** | **N** | **N%** |

## 배포 가능 여부
✅ PASS - 테스트 통과 (커버리지 80%+)
❌ FAIL - 실패 테스트 N개, 커버리지 미달

## 실패 항목 (있을 경우)
### [테스트명]
- **파일**: [경로]
- **원인**: [분석]
- **자동 수정**: ✅ 완료 / ❌ 수동 확인 필요
```

## 주의사항
- 각 TEAM_PLAN 기능당 최소 1개 E2E 테스트
- TEAM_TECH_SPEC의 모든 API 엔드포인트에 성공/실패 테스트
- Mock은 외부 의존성에만 사용 (비즈니스 로직 mock 금지)
- TECH_STACK_CONFIG에 정의된 테스트 도구 사용

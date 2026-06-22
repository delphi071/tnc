---
name: api-developer
description: "API 서버 개발 스킬. TECH_STACK_CONFIG에 정의된 백엔드 기술 스택으로 구현. REST API, 미들웨어, 인증, DB 연동 요청 시 활성화."
---

# API Developer Skill

## 역할
TEAM_TECH_SPEC의 API 명세와 TEAM_DB_SCHEMA의 DB 스키마를 기반으로 TECH_STACK_CONFIG에 정의된 백엔드 프레임워크로 API 서버를 구현하는 도구입니다.

## 프로젝트 구조 표준

```
server/
├── src/
│   ├── index.ts          # 진입점
│   ├── app.ts            # 서버 앱 설정
│   ├── types/            # 공통 타입 정의
│   ├── middleware/
│   │   ├── auth.ts       # 인증 검증
│   │   ├── validate.ts   # 입력값 검증
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── index.ts      # 라우터 통합
│   │   └── [feature].ts  # 기능별 라우터
│   ├── controllers/      # HTTP 처리 (얇게)
│   ├── services/         # 비즈니스 로직
│   └── lib/
│       └── db.ts         # DB 클라이언트 (ORM)
├── [ORM 스키마 디렉토리]  # TECH_STACK_CONFIG에 따라 (예: prisma/)
└── .env.example
```

---

## 공통 응답 헬퍼

```typescript
// src/lib/response.ts
export const success = <T>(data: T) => ({ success: true, data });
export const error = (code: string, message: string) =>
  ({ success: false, error: { code, message } });
```

---

## 라우터 → 컨트롤러 → 서비스 패턴

```typescript
// routes/auth.ts
import { Router } from 'express';
import { validate } from '@/middleware/validate';
import { loginSchema } from '@/types/auth';
import { AuthController } from '@/controllers/auth';

const router = Router();
router.post('/login', validate(loginSchema), AuthController.login);
export default router;

// controllers/auth.ts
export class AuthController {
  static login = async (req: Request, res: Response) => {
    try {
      const result = await AuthService.login(req.body);
      res.json(success(result));
    } catch (err) {
      res.status(401).json(error('AUTH_FAILED', '인증 실패'));
    }
  };
}

// services/auth.ts
export class AuthService {
  static login = async ({ email, password }: LoginRequest) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('USER_NOT_FOUND');
    // 비밀번호 검증
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    return { token, user: { id: user.id, email: user.email } };
  };
}
```

---

## 입력값 검증 (기본 예시: Zod — TECH_STACK_CONFIG에 따라 조정)

```typescript
// types/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginRequest = z.infer<typeof loginSchema>;
```

---

## .env.example 표준

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

## 구현 규칙
- TECH_SPEC의 API 명세 엔드포인트 그대로 구현
- 모든 입력값에 TECH_STACK_CONFIG에 정의된 검증 도구 적용
- 에러에 적절한 HTTP 상태코드 반환
- 민감 정보 환경변수 처리

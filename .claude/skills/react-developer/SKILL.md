---
name: react-developer
description: "React(Web) 및 React Native(App) 개발 스킬. 컴포넌트 구현, 상태 관리, API 연동, 화면 개발 요청 시 활성화."
---

# React Developer Skill

## 역할
TEAM_TECH_SPEC의 API 명세를 기반으로 React(Web) 또는 React Native(App) UI를 구현하는 도구입니다.

## 플랫폼 판별

TEAM_TECH_SPEC의 플랫폼 항목 확인:
- **Web** → TECH_STACK_CONFIG의 웹 프레임워크 패턴 사용
- **App** → TECH_STACK_CONFIG의 앱 프레임워크 패턴 사용
- **Both** → 공통 타입/로직을 `shared/` 패키지로 분리

---

## API 클라이언트 표준 (기본 예시: Axios — TECH_STACK_CONFIG에 따라 조정)

```typescript
// frontend/src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// 인터셉터: 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 인터셉터: 에러 처리
api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data?.error)
);
```

---

## 상태 관리 패턴 (기본 예시: Zustand — TECH_STACK_CONFIG에 따라 조정)

```typescript
// frontend/src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

---

## API 훅 패턴 (기본 예시: React Query — TECH_STACK_CONFIG에 따라 조정)

```typescript
// frontend/src/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data) => api.post('/auth/login', data),
  });
}
```

---

## Mock 사용 규칙 (backend 완료 전)

```typescript
// frontend/src/lib/api.mock.ts
export const mockApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    await new Promise(r => setTimeout(r, 500)); // 지연 시뮬레이션
    return { success: true, data: { token: 'mock-token', user: {...} } };
  }
};
```

backend 완료 후 mock → 실제 api로 교체

---

## DESIGN_SPEC 준수 (존재 시)
TEAM_DESIGN_SPEC.md가 존재하면 추가로 준수:
- 디자인 토큰으로 스타일링 (색상/폰트/간격 하드코딩 금지)
- 컴포넌트 Props/상태를 DESIGN_SPEC 그대로 구현
- 레이아웃/반응형을 DESIGN_SPEC 그대로 구현
- 에셋은 DESIGN_SPEC에 명시된 경로/포맷 사용

## 구현 규칙
- 타입은 TEAM_TECH_SPEC의 인터페이스 그대로 사용
- 컴포넌트는 단일 책임 원칙
- 접근성(a11y) 기본 속성 추가
- 에러 상태, 로딩 상태 반드시 처리

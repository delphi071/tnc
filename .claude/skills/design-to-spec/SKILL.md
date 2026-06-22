---
name: design-to-spec
description: "Figma에서 추출된 디자인 데이터를 TEAM_DESIGN_SPEC 문서로 변환하고 TEAM_TECH_SPEC과 연결하는 스킬. 디자인 명세 작성, 디자인-코드 매핑 요청 시 활성화."
---

# Design to Spec Skill (Team)

## 역할
figma-extractor가 추출한 디자인 데이터를 팀 개발 환경에 맞는 TEAM_DESIGN_SPEC 문서로 변환합니다.

## TEAM_DESIGN_SPEC 출력 템플릿

```markdown
# TEAM_DESIGN_SPEC: [프로젝트명]

## 1. 디자인 소스 정보
- Figma: [URL]
- 추출 방식: [Figma MCP / Google Stitch → Figma]
- 총 페이지: N개
- 총 컴포넌트: N개

## 2. 스타일 시스템

### 2.1 색상 토큰
| Figma 스타일명 | 토큰명 | 값 | 스타일 매핑 |
|---------------|--------|-----|---------|

### 2.2 타이포그래피 토큰
| Figma 스타일명 | 토큰명 | 크기 | 굵기 | 행간 |
|---------------|--------|------|------|------|

### 2.3 간격 토큰
| 값 | 토큰명 | 스타일 매핑 |
|----|--------|---------|

### 2.4 기타 토큰 (그림자, 라운딩, 트랜지션)

## 3. 컴포넌트 명세

### 3.1 [ComponentName]
- **Figma 경로**: Page > Frame > Component
- **파일**: `frontend/src/components/[경로]/ComponentName.tsx`
- **Props**:
  ```typescript
  interface ComponentNameProps {
    variant: "primary" | "secondary";
    size: "sm" | "md" | "lg";
    disabled?: boolean;
    children: React.ReactNode;
  }
  ```
- **상태별 스타일**:
  | 상태 | 배경 | 텍스트 | 테두리 |
  |------|------|--------|--------|
  | default | ... | ... | ... |
  | hover | ... | ... | ... |
  | disabled | ... | ... | ... |
- **레이아웃**: `flex items-center justify-center gap-2`
- **API 연동**: `GET /api/[resource]` (TEAM_TECH_SPEC 참조)

## 4. 페이지 레이아웃

### 4.1 [PageName] (/route)
```
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│ Main Content                │
│ ┌───────────┐ ┌───────────┐ │
│ │ CompA     │ │ CompB     │ │
│ └───────────┘ └───────────┘ │
├─────────────────────────────┤
│ Footer                      │
└─────────────────────────────┘
```
- 사용 컴포넌트: [목록]
- API 호출: [TEAM_TECH_SPEC 엔드포인트]
- 반응형: [브레이크포인트별 변화]

## 5. 에셋 목록
| 에셋명 | 포맷 | 용도 | 저장 경로 |
|--------|------|------|----------|
| logo | SVG | 헤더 로고 | frontend/public/icons/logo.svg |

## 6. TECH_SPEC 연결 매트릭스
| DESIGN_SPEC 컴포넌트 | TECH_SPEC 파일 | TEAM_PLAN 기능 | API 엔드포인트 |
|---------------------|---------------|---------------|---------------|
| LoginForm | frontend/src/components/auth/LoginForm.tsx | 로그인 | POST /api/auth/login |
```

## 팀 연동 규칙

### → @architect (TEAM_TECH_SPEC)
- DESIGN_SPEC의 컴포넌트 목록 → TECH_SPEC 파일 구조에 반영
- 디자인 토큰 → TECH_STACK_CONFIG의 스타일링 도구 설정에 참조
- 페이지 레이아웃 → 라우팅 구조에 반영

### → @frontend (구현)
- DESIGN_SPEC의 컴포넌트 명세를 그대로 구현
- Props, 상태, 레이아웃, 토큰 모두 준수
- 에셋 경로와 포맷 준수

### → @qa (검증)
- DESIGN_SPEC을 기준으로 디자인-코드 일치 검증 항목 추가

## 충돌 해결 규칙
- DESIGN_SPEC(시각 디자인) vs TECH_SPEC(기술 구조) 충돌 시:
  - 파일 경로: TECH_SPEC 우선
  - 컴포넌트 Props: DESIGN_SPEC 우선 (시각적 요구사항)
  - API 구조: TECH_SPEC 우선
  - 충돌 사항은 @pm에게 보고하여 조율

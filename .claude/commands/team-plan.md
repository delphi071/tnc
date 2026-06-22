---
name: team-plan
description: "@pm 에이전트를 호출하여 팀 작업 계획 수립. 팀 기획, 요구사항 분석, 역할 배분, 병렬 계획 요청 시 사용."
category: team
complexity: basic
allowed-tools: [Read, Write, Edit]
---

# /team-plan - 팀 작업 계획 수립

## 동작
@pm 에이전트를 호출하여 프로젝트 요구사항을 분석하고 팀 작업 계획을 수립합니다.

## 사용법
```
/team-plan [프로젝트 아이디어]
```

## 실행 순서

### Step 1: @pm 에이전트 활성화
- project-coordinator 스킬 자동 활성화

### Step 2: 요구사항 파악 (질문)
@pm이 사용자에게 확인:
- 플랫폼 (Web / App / Both)
- API 서버 필요 여부
- DB 종류
- 인증 필요 여부
- 주요 기능 목록

### Step 3: TEAM_PLAN.md 작성
- 기능 목록
- 역할별 담당 기능
- 병렬 실행 그룹 설계 (최대 3개 동시)

### Step 4: TEAM_STATUS.md 초기화
- 각 에이전트 상태 초기화

## 출력물
- `docs/TEAM_PLAN.md`
- `docs/TEAM_STATUS.md`

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- 현재 Phase: Phase 1 (plan)
- 상태: 🔄 진행중

Phase 완료 시 업데이트:
- Phase 1: ✅ 완료 + 완료 시각

## 완료 메시지
```
✅ 팀 계획 수립 완료

📋 요약
- 플랫폼: [Web/App/Both]
- 기능: N개
- 팀: PM + Designer(선택) + Architect + DBA + Frontend + Backend + QA

다음 단계:
  🎨 Figma 디자인이 있다면 → /team-figma
  📐 디자인 없이 진행 → /team-design
  ⚡ 자동 실행 → /team-auto (디자인 선택지 자동 표시)
```

---
name: team-auto
description: "에이전트 팀 전체 파이프라인을 자동 실행하는 핵심 커맨드. 팀 자동 빌드, 풀스택 자동 실행, 에이전트팀 시작 요청 시 사용."
category: team
complexity: enhanced
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# /team-auto - 팀 자동 체인 (핵심)

## 동작
PM이 계획을 수립하고, 설계와 구현을 최대 3개 에이전트 병렬로 자동 실행합니다.

## 사용법
```
/team-auto [프로젝트 아이디어]
```

## 팀 구성

| 역할 | 에이전트 | 실행 Phase |
|------|---------|-----------|
| 오케스트레이터 | @pm | 전체 |
| UI/UX 디자인 | @designer | Phase 1.5 (선택) |
| 기술 설계 | @architect | Phase 2 (병렬) |
| DB 설계 | @dba | Phase 2 (병렬) |
| 프론트엔드 | @frontend | Phase 3 (병렬) |
| 백엔드 | @backend | Phase 3 (병렬) |
| QA | @qa | Phase 4 (순차) |
| 테스트 | @tester | Phase 5 (순차) |
| 보안 감사 | @auditor | Phase 5 (병렬) |

---

## ⚡ 자동 실행 구조

```
[사용자 입력: /team-auto "프로젝트 아이디어"]

🔀 team-auto 라우팅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Phase 0] /team-init
  → 폴더 구조 + 기술 스택 설정 (TECH_STACK_CONFIG) ← 사용자 기술 스택 선택

[Phase 1] /team-plan (@pm)
  → 요구사항 파악 (사용자에게 질문)
  → TEAM_PLAN + TEAM_STATUS 작성

[Phase 1.5] 🎨 디자인 선택지
  → 1️⃣ Figma에서 가져오기 → /team-figma (@designer)
  → 2️⃣ 디자인 없이 진행 → 스킵
  → TEAM_DESIGN_SPEC 이미 존재 시 → 자동 스킵

[Phase 2] /team-design  ← 병렬 2개 동시
  ┌────────────────┬────────────────┐
  │ @architect     │ @dba           │
  │ TEAM_TECH_SPEC │ TEAM_DB_SCHEMA │
  │ (DESIGN_SPEC   │                │
  │  참조)         │                │
  └────────────────┴────────────────┘
  → @pm: API ↔ DB 정합성 조율

[Phase 3] /team-build  ← 병렬 3개 동시
  ┌──────────┬──────────┬──────────┐
  │@frontend │@backend  │@dba      │
  │frontend/ │server/   │ORM       │
  │src/      │src/      │스키마    │
  │(DESIGN   │          │          │
  │ _SPEC    │          │          │
  │ 참조)    │          │          │
  └──────────┴──────────┴──────────┘
  → @pm: mock → 실제 API 교체 + 통합 확인

[Phase 4] /team-review (@qa)
  → 인터페이스 계약 검증 + DB↔API 정합성 + 코드 품질 + 디자인 일치(선택)
  → PASS: Phase 5 진행
  → FAIL: 담당 에이전트(@frontend/@backend) 자동 수정 → 재검증 (최대 2회)
  → 2회 실패 시 수동 확인 항목으로 분류, Phase 5 진행

[Phase 5] /team-test + /team-audit  ← 병렬 2개 동시
  ┌──────────────────┬──────────────────┐
  │ @tester          │ @auditor         │
  │ Frontend 테스트   │ Frontend 보안    │
  │ Backend 테스트    │ Backend 보안     │
  │ E2E 테스트       │ 의존성 점검      │
  │ → TEST_REPORT   │ → AUDIT_REPORT  │
  └──────────────────┴──────────────────┘
  → 테스트 FAIL: 자동 수정 루프 (최대 3회)
  → CRITICAL/HIGH 보안: 자동 수정 시도 → 불가 시 수동 확인
  → 둘 다 PASS: Phase 6 진행

[Phase 6] /team-deploy
  → staging 배포 → 사용자 확인 → production

[Phase 7] /team-monitor
  → frontend + backend 모니터링 설정

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 사용자 개입 시점 (4번만)

1. **Phase 0 (team-init)**: 기술 스택 질문 (프레임워크, DB, 배포 등) → `TECH_STACK_CONFIG.md` 생성
   - 이미 존재 시 자동 스킵

2. **Phase 1 (team-plan)**: @pm의 질문에 답변
   - 플랫폼, API 필요 여부, 주요 기능 등

3. **Phase 1.5 (디자인 선택)**: Figma 가져오기 vs 디자인 없이 진행
   - Figma 선택 시 파일 URL 입력

4. **Phase 6 (team-deploy)**: staging URL 직접 확인 후 production 승인

---

## 전제조건 자동 체크

```
입력 감지 시:
├── TEAM_STATUS.md 존재 시 → 읽어서 현재 상태 파악, 중단된 Phase부터 재개
├── docs/ 없음 → Phase 0(init)부터 전체 체인 실행
├── TEAM_PLAN 없음 → Phase 1(plan)부터 실행
├── TEAM_PLAN 있음 + TEAM_DESIGN_SPEC 없음 + TEAM_TECH_SPEC 없음 → Phase 1.5(디자인 선택)부터 실행
├── TEAM_TECH_SPEC 없음 (DESIGN_SPEC 존재 또는 스킵 완료) → Phase 2(design)부터 실행
├── frontend/src 없음 → Phase 3(build)부터 실행
├── TEAM_QA_REPORT 없음 → Phase 4(review)부터 실행
├── TEAM_TEST_REPORT 없음 + TEAM_AUDIT_REPORT 없음 → Phase 5 전체 실행 (test+audit 병렬)
├── TEAM_TEST_REPORT 있음 + TEAM_AUDIT_REPORT 없음 → @auditor만 실행
├── TEAM_TEST_REPORT 없음 + TEAM_AUDIT_REPORT 있음 → @tester만 실행
└── 배포 미완료 → Phase 6(deploy)부터 실행
```

---

## TEAM_STATUS.md 자동 관리

각 Phase 시작/완료 시 자동으로 `docs/TEAM_STATUS.md`를 업데이트합니다.
세션이 끊겨도 이 파일을 읽으면 정확한 진행 상태를 파악할 수 있습니다.

### TEAM_STATUS.md 형식
```markdown
# TEAM_STATUS

## 현재 상태
- 마지막 실행: {timestamp}
- 현재 Phase: {phase name}
- 중단 지점: {detail}

## Phase별 상태
| Phase | 상태 | 완료 시각 | 비고 |
|-------|------|----------|------|
| 0 init | ⏳/🔄/✅ | | |
| 1 plan | ⏳/🔄/✅ | | |
| 1.5 figma | ⏳/🔄/✅/⏭️ | | |
| 2 design | ⏳/🔄/✅ | | @architect: ✅, @dba: ✅ |
| 3 build | ⏳/🔄/✅ | | @frontend: ✅, @backend: 🔄, @dba: ✅ |
| 4 review | ⏳/🔄/✅ | | PASS/FAIL |
| 5 test+audit | ⏳/🔄/✅ | | @tester: ✅, @auditor: 🔄 |
| 6 deploy | ⏳/🔄/✅ | | staging/production URL |
| 7 monitor | ⏳/🔄/✅ | | |

## 수동 확인 필요 항목
- [ ] {item}

## 사용자 메모
(자유 기입)
```

상태 아이콘:
- ⏳ 대기
- 🔄 진행중
- ✅ 완료
- ⏭️ 스킵
- ❌ 실패

### 상태 복원 우선순위
TEAM_STATUS.md가 존재하면 **파일 존재 여부 체크보다 먼저** 읽어서 상세 상태를 파악합니다:
1. TEAM_STATUS.md 읽기 → 현재 Phase, 각 에이전트 완료 상태, 수동 확인 항목 파악
2. 중단된 Phase가 명확하면 해당 Phase부터 재개
3. TEAM_STATUS.md가 없거나 불완전하면 → 파일 존재 여부 체크로 fallback

### 상태 충돌 해결
TEAM_STATUS.md와 실제 파일 상태가 다를 경우:
1. TEAM_STATUS.md에서 ✅ 완료로 표시된 Phase의 출력 파일이 실제로 존재하는지 검증
2. 출력 파일 누락 시 → 사용자에게 경고 + 해당 Phase 재실행 제안
3. TEAM_STATUS.md에 없는 파일이 존재하는 경우 → TEAM_STATUS.md를 실제 파일 기준으로 업데이트

---

## 최종 결과 보고

```
🎉 팀 프로젝트 완료

📊 팀 실행 결과
| Phase | 결과 | 병렬 |
|-------|------|------|
| init | ✅ | - |
| plan | ✅ | - |
| figma | ✅ / ⏭️ 스킵 | - |
| design | ✅ | 2개 동시 |
| build | ✅ | 3개 동시 |
| review | ✅ | - |
| test+audit | ✅ | 2개 동시 |
| deploy | ✅ | - |
| monitor | ✅ | - |

🌐 Frontend: https://[url]
🔧 Backend: https://[url]

⚠️ 수동 확인 항목: N개
  1. [항목]

📂 팀 문서
  - docs/TEAM_PLAN.md
  - docs/TEAM_DESIGN_SPEC.md (Figma 사용 시)
  - docs/TEAM_TECH_SPEC.md
  - docs/TEAM_DB_SCHEMA.md
  - docs/TEAM_QA_REPORT.md
  - docs/TEAM_TEST_REPORT.md
  - docs/TEAM_AUDIT_REPORT.md
```

---

## 전체 비교

| | 서브에이전트 방식 | **에이전트 팀 방식** |
|--|----------------|-------------------|
| 폴더 | `.claude/` | `.claude_team/` |
| 커맨드 | `/mvp-auto` | `/team-auto` |
| 개발 방식 | 순차 | **병렬 (최대 3개)** |
| 적합한 프로젝트 | 소규모 MVP | **풀스택, 규모 있는 프로젝트** |
| 사용자 입력 | 3회 | **4회** (기술 스택 + plan 질문 + 디자인 선택 + staging 확인) |

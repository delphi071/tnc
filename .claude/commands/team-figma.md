---
name: team-figma
description: "Figma MCP를 통해 디자인을 가져와 TEAM_DESIGN_SPEC을 작성하는 커맨드. 팀 디자인 가져오기, Figma 연동, UI 디자인 추출 요청 시 사용. 전제조건: TEAM_PLAN.md 필수."
category: team
complexity: enhanced
allowed-tools: [Read, Write, Edit, Bash, mcp__figma]
---

# /team-figma - 팀 디자인 가져오기

## 동작
@designer 에이전트를 호출하여 Figma에서 디자인을 추출하고 TEAM_DESIGN_SPEC.md를 작성합니다.
이후 /team-design에서 @architect가 이 문서를 참조하여 기술 설계를 진행합니다.

## 사용법
```
/team-figma [Figma 파일 URL 또는 파일 키]
```

## 🎨 최초 선택지

사용자에게 반드시 확인:
```
디자인을 어떻게 준비하시겠습니까?

1️⃣  Figma에서 가져오기
    → 전문 디자이너가 작업 완료했거나
    → Google Stitch에서 Figma로 변환 완료한 경우
    → Figma 파일 URL을 알려주세요.

2️⃣  디자인 없이 진행
    → 기본 UI로 진행합니다.
    → /team-design 으로 바로 이동합니다.
```

## 전제조건
- **docs/TEAM_PLAN.md 필수**: 기능 목록 참조
- 없으면 → "/team-plan을 먼저 실행하세요."
- **Figma MCP 연결 필수**

## 실행 순서

### Step 1: 전제조건 체크
```
TEAM_PLAN.md 존재 확인
├── 존재 → Step 2
└── 미존재 → 안내 후 중단
```

### Step 2: 디자인 선택지 제시
- 1️⃣ 선택 → Step 3으로
- 2️⃣ 선택 → "/team-design으로 이동합니다." 안내 후 종료

### Step 3: @designer 에이전트 활성화
- figma-extractor 스킬로 디자인 데이터 추출

### Step 4: Figma MCP를 통한 추출
1. 파일 구조 파악
2. 컴포넌트 목록 추출 (variants 포함)
3. 스타일/토큰 추출
4. 레이아웃 분석
5. 에셋 목록 정리

### Step 5: TEAM_DESIGN_SPEC.md 작성
- design-to-spec 스킬로 추출 데이터 → 문서화
- TEAM_PLAN의 기능과 디자인 컴포넌트 매핑
- frontend/src/ 구조에 맞게 파일 경로 매핑

### Step 6: TEAM_PLAN 기능 ↔ 디자인 매핑 검증
```
TEAM_PLAN 기능 목록의 각 기능에 대해:
├── 해당 기능의 UI가 디자인에 존재하는가?
├── 존재 → 매핑 기록
└── 미존재 → "디자인 누락" 경고
```

### Step 7: TEAM_STATUS 업데이트
```
@designer: ✅ 완료
```

## ⚠️ Figma MCP 실패 시 처리
```
Figma MCP 연결 실패 시:
├── MCP 서버 미설정 → "Figma MCP가 설정되지 않았습니다.
│                      설정 후 다시 시도하거나, 2️⃣ 디자인 없이 진행을 선택하세요."
│                      → 사용자에게 재선택 기회 제공
├── 파일 키 오류 → "Figma 파일을 찾을 수 없습니다. URL을 확인해주세요."
│                  → 재입력 요청 (최대 2회)
└── 추출 중 오류 → 추출 성공한 부분까지 DESIGN_SPEC에 저장
                   → "일부 추출 실패" 경고와 함께 다음 단계로 진행
```

**체인 끊김 방지**: 어떤 실패 상황에서도 사용자가 "디자인 없이 진행"을 선택할 수 있도록 하여, /team-design으로의 체인이 끊기지 않는다.

## 상태 업데이트
Phase 시작 시 `docs/TEAM_STATUS.md`에 기록:
- 현재 Phase: Phase 1.5 (figma)
- 상태: 🔄 진행중

Phase 완료 시 업데이트:
- Phase 1.5: ✅ 완료 + 완료 시각 (또는 ⏭️ 스킵)

## 출력물
- `docs/TEAM_DESIGN_SPEC.md`

## 완료 메시지
```
✅ 팀 디자인 추출 완료

🎨 디자인 결과
- 페이지: N개
- 컴포넌트: N개
- 디자인 토큰: 색상 N개, 타이포 N개, 간격 N개
- TEAM_PLAN 기능 매핑: N/N 완료

📋 누락 경고: [있으면 표시]

다음 단계: /team-design 으로 병렬 설계를 시작하세요.
(@architect가 TEAM_DESIGN_SPEC을 참조하여 설계합니다)
```

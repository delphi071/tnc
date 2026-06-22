---
name: figma-extractor
description: "Figma MCP를 통해 디자인 파일에서 컴포넌트, 토큰, 레이아웃을 추출하는 스킬. Figma 가져오기, 디자인 추출, 컴포넌트 분석 요청 시 활성화."
---

# Figma Extractor Skill (Team)

## 역할
Figma MCP를 사용하여 디자인 파일에서 구조화된 데이터를 추출하는 도구입니다.
팀 환경에서는 frontend/server 분리 구조에 맞게 추출합니다.

## Figma MCP 사용 흐름

### Step 1: 파일 접근
```
Figma MCP → get_file(fileKey)
→ 전체 파일 구조 파악
```

### Step 2: 페이지/프레임 탐색
```
Figma MCP → get_file_nodes(fileKey, nodeIds)
→ 특정 페이지/프레임의 상세 데이터
```

### Step 3: 컴포넌트 추출
```
Figma MCP → get_file_components(fileKey)
→ 모든 컴포넌트 목록 + variants
```

### Step 4: 스타일 추출
```
Figma MCP → get_file_styles(fileKey)
→ 색상, 타이포, 효과 스타일
```

### Step 5: 이미지/에셋 추출
```
Figma MCP → get_image(fileKey, nodeIds, format)
→ 아이콘/이미지를 SVG/PNG로 내보내기
```

## 추출 데이터 구조

### 디자인 토큰 추출 규칙

**색상 (Colors)**
```
Figma Fill → CSS 변수 매핑
- Solid: rgba → hex/rgb
- Gradient: linear-gradient()
- 네이밍: Figma 스타일명 → kebab-case 토큰명
```

**타이포그래피 (Typography)**
```
Figma Text Style → CSS 폰트 매핑
- fontFamily → font-family
- fontSize → font-size (px → rem, base 16px)
- fontWeight → font-weight
- lineHeight → line-height
- letterSpacing → letter-spacing
```

**간격 (Spacing)**
```
Figma Auto Layout → CSS 간격 매핑
- itemSpacing → gap
- padding → padding
- 4px 단위로 정규화
```

**그림자/라운딩**
```
Figma Effect → box-shadow
Figma cornerRadius → border-radius
```

### 컴포넌트 추출 → 팀 구조 매핑

```
Figma Component → frontend/src/ 구조로 매핑

Component "Card"
→ frontend/src/components/common/Card.tsx

Page "Dashboard"
→ frontend/src/pages/Dashboard.tsx
→ 사용하는 API: TEAM_TECH_SPEC의 엔드포인트 참조
```

### Auto Layout → Flexbox 매핑
```
layoutMode: "HORIZONTAL" → flex-direction: row
layoutMode: "VERTICAL"   → flex-direction: column
primaryAxisAlignItems → justify-content
counterAxisAlignItems → align-items
layoutWrap: "WRAP" → flex-wrap: wrap
```

## 팀 특화: frontend/server 분리 고려
- 컴포넌트 파일 경로: `frontend/src/components/` 하위
- 페이지 파일 경로: `frontend/src/pages/` 하위
- API 연동 포인트: TEAM_TECH_SPEC의 API 명세와 연결
- 에셋 저장 경로: `frontend/public/` 하위

## 주의사항
- ❌ 추출 시 값을 임의 정규화하지 않음 (원본 유지)
- ✅ Figma 스타일명 → 개발용 토큰명 매핑 테이블 반드시 포함
- ✅ 추출 불가능한 항목은 "수동 확인 필요" 표기

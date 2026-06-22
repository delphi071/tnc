---
name: db-designer
description: "데이터베이스 스키마 설계 스킬. TECH_STACK_CONFIG의 ORM 스키마 작성, ERD 설계, 데이터 모델링, 마이그레이션 설계 요청 시 활성화."
---

# DB Designer Skill

## 역할
TEAM_PLAN의 기능 목록에서 데이터 요구사항을 도출하고 TECH_STACK_CONFIG에 정의된 ORM의 스키마를 설계하는 도구입니다.

## 출력 템플릿: TEAM_DB_SCHEMA.md

```markdown
# TEAM_DB_SCHEMA: [프로젝트명]

## 1. 엔티티 목록
| 엔티티 | 설명 | 주요 관계 |
|-------|------|---------|
| User | 사용자 | 1:N [관련엔티티] |
| [Entity] | [설명] | [관계] |

---

## 2. ERD (텍스트)
```
User 1 ──── N Post
Post N ──── N Tag (PostTag)
User 1 ──── 1 Profile
```

---

## 3. ORM 스키마 (TECH_STACK_CONFIG의 ORM에 따라, 아래는 Prisma 예시)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  posts     Post[]
  profile   Profile?

  @@index([email])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])

  @@index([authorId])
}
```

---

## 4. 인덱스 전략
| 테이블 | 인덱스 컬럼 | 이유 |
|-------|-----------|------|
| User | email | 로그인 조회 |
| Post | authorId | 사용자별 글 조회 |
```

## 스키마 설계 규칙
1. **기본 필드**: 모든 모델에 `id`, `createdAt`, `updatedAt` 필수
2. **ID 타입**: `String @id @default(cuid())` 표준 사용
3. **인덱스**: 외래키 및 자주 조회되는 컬럼에 반드시 설정
4. **관계**: 양방향 관계 명시
5. **Soft Delete**: 삭제 시 `deletedAt DateTime?` 추가 (필요 시)

## backend와의 연동 규칙
- ORM 스키마가 확정되면 backend는 이 파일 그대로 해당 ORM의 스키마 파일로 복사
- 스키마 변경은 반드시 이 문서 먼저 수정 후 backend에 반영

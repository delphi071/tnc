"use client";

import Image from "next/image";
import { useT } from "@/i18n/useT";

/** "04. 함께 걷는 사람들 contents" — 단체 카드 4개를 2×2 그리드로 배치
 *  (Figma node 1364:7658 도 2×2: 로고 위 / 제목·설명·버튼 아래, 가운데 정렬).
 *
 *  타이포·로고·버튼 크기는 기존(1카드 1화면) 그대로 유지한다. 그 결과 그리드 전체가
 *  한 화면(1080)을 넘기므로, 이 섹션은 핀 고정이 아니라 일반 스크롤 섹션으로 쓴다.
 *  → WalkingTogetherHero 에서 높이를 측정해 스케일 래퍼에 반영한다. */
export type OrgCard = {
  logo: string;
  /** 로고 박스 가로폭(px, 세로 240 고정) */
  logoW: number;
  title: string;
  lines: string[];
  href: string;
  /** 상단 메뉴·푸터의 #kta/#atn/#wtn/#gko 로 이 카드 위치를 찾기 위한 앵커 id */
  anchor: string;
};

/** 가로 지오메트리는 사이트 표준에 맞춘다.
 *  - 컨테이너 1200: NoticeDetail·NoticesSection·SameTrailHero 가 쓰는 표준 폭
 *  - 본문 520: SameTrailHero(474~755)·HistoryScreen(700)·TabCarousel(680) 과 같은 대역
 *  (Core Value 의 430 은 4개를 한 줄에 넣느라 좁은 예외라 기준으로 삼지 않는다) */
const CELL_W = 600;
const COL_GAP = 0;
const ROW_GAP = 120;
const TEXT_W = 520;
/** 섹션 상하 여백 (Figma pt-200 / pb-300 을 스크롤 섹션에 맞게 축소) */
const PAD_Y = 160;

function Card({ logo, logoW, title, lines, href, anchor }: OrgCard) {
  const learnMore = useT().walkingTogether.learnMore;
  // 사전의 줄나눔은 "로고 옆 전체폭" 레이아웃 기준이라 셀 폭(780)에서는 넘친다.
  // 한 문단으로 합쳐 셀 폭 안에서 자동 줄바꿈시킨다 (기존의 한국어 nowrap 제거).
  const body = lines.join(" ");
  return (
    <div id={`org-${anchor}`} className="flex h-full flex-col items-center text-center" style={{ width: CELL_W }}>
      <div className="relative shrink-0" style={{ width: logoW, height: 240 }}>
        <Image src={logo} alt="" fill sizes="332px" className="object-contain" />
      </div>
      <p
        className="shrink-0 font-bold text-black"
        style={{ marginTop: 32, fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.832px" }}
      >
        {title}
      </p>
      {/* grow: 같은 행 카드끼리 설명 줄 수가 달라도 남는 높이를 흡수해 버튼 높이를 맞춘다 */}
      <p
        className="grow"
        style={{ marginTop: 32, width: TEXT_W, fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.18px", color: "#5a5b5d" }}
      >
        {body}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[50px] w-[182px] shrink-0 items-center justify-center rounded-br-[20px] rounded-tl-[20px] bg-[#0ac200] transition-opacity hover:opacity-90"
        style={{ marginTop: 52 }}
      >
        <span className="font-bold text-black" style={{ fontSize: 14, lineHeight: 1.5 }}>
          {learnMore}
        </span>
      </a>
    </div>
  );
}

export default function OrgCardSection({ cards }: { cards: OrgCard[] }) {
  return (
    <div
      className="flex justify-center"
      style={{ paddingTop: PAD_Y, paddingBottom: PAD_Y }}
    >
      <div className="grid grid-cols-2 items-stretch" style={{ columnGap: COL_GAP, rowGap: ROW_GAP }}>
        {cards.map((c) => (
          <Card key={c.anchor} {...c} />
        ))}
      </div>
    </div>
  );
}

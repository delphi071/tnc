"use client";

/* eslint-disable @next/next/no-img-element */

import { useT } from "@/i18n/useT";

/** "04. 함께 걷는 사람들 contents" — 단체 4개를 세로로 하나씩 쌓는다(Figma node 1364:7658).
 *  각 단체 = 로고(좌) + 콘텐츠(우: 제목·자세히보기·소개·개요불릿·KEY ACTIVITIES·WALKING TOGETHER).
 *  Figma 는 단체당 한 화면(1080)이라, 이 섹션은 핀 고정이 아닌 일반 스크롤로 하나씩 내려간다.
 *  1920 좌표로 조판한 뒤 WalkingTogetherHero 가 높이를 재서 스케일 래퍼에 반영한다. */
export type OrgCard = {
  logo: string;
  title: string;
  intro: string;
  /** 개요 불릿(초록 사각 마커) */
  overview: string[];
  /** KEY ACTIVITIES 불릿 */
  keyActivities: string[];
  /** WALKING TOGETHER 불릿 */
  together: string[];
  href: string;
  /** 상단 메뉴·푸터의 #kta/#wtn/#atn/#gko 로 이 단체 위치를 찾기 위한 앵커 id */
  anchor: string;
};

const CONTENT_W = 900; // Figma Frame 255
const LOGO_W = 240; // Figma logo-container
const GAP = 40; // 로고 ↔ 콘텐츠
const COL_W = 450; // KEY ACTIVITIES / WALKING TOGETHER 각 열

/** 초록 사각 마커(개요 불릿) */
function SquareBullet() {
  return <span className="mt-[6px] shrink-0 rounded-[1px] bg-[#0ac200]" style={{ width: 4, height: 16 }} />;
}

/** KEY ACTIVITIES / WALKING TOGETHER 소제목 + 불릿 목록 */
function ActivityCol({ label, items }: { label: string; items: string[] }) {
  return (
    <div style={{ width: COL_W }}>
      <p
        className="font-bold text-[#0ac200]"
        style={{ fontFamily: "var(--font-montserrat)", fontSize: 14, letterSpacing: "0.5px" }}
      >
        {label}
      </p>
      <div className="mt-[20px] flex flex-col gap-[11px]">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-[11px]">
            <span className="shrink-0 leading-[1.3] text-[#0ac200]" style={{ fontSize: 16 }}>•</span>
            <span className="leading-[1.3] text-[#3d3d3d]" style={{ fontSize: 16 }}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ logo, title, intro, overview, keyActivities, together, href, anchor }: OrgCard) {
  const learnMore = useT().walkingTogether.learnMore;
  return (
    <section id={`org-${anchor}`} className="flex items-center justify-center" style={{ minHeight: 1080 }}>
      <div className="flex items-start" style={{ gap: GAP }}>
        {/* 로고 (좌) */}
        <div className="shrink-0" style={{ width: LOGO_W }}>
          <img src={logo} alt={title} className="h-auto w-full object-contain object-left-top" />
        </div>

        {/* 콘텐츠 (우) */}
        <div style={{ width: CONTENT_W }}>
          {/* 제목 + 자세히 보기 */}
          <div className="flex items-baseline justify-between">
            <h2 className="font-bold text-black" style={{ fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.832px" }}>
              {title}
            </h2>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-[6px] text-[#0ac200] transition-opacity hover:opacity-80"
              style={{ fontSize: 16, lineHeight: 1.5 }}
            >
              <span className="font-semibold">{learnMore}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          {/* 소개 */}
          <p className="mt-[32px] text-[#3d3d3d]" style={{ fontSize: 18, lineHeight: 1.6, letterSpacing: "-0.18px" }}>
            {intro}
          </p>

          {/* 개요 불릿 */}
          <div className="mt-[32px] flex flex-col gap-[12px]">
            {overview.map((it, i) => (
              <div key={i} className="flex items-start gap-[12px]">
                <SquareBullet />
                <span className="leading-[1.35] text-[#5a5b5d]" style={{ fontSize: 16 }}>{it}</span>
              </div>
            ))}
          </div>

          {/* KEY ACTIVITIES / WALKING TOGETHER (2열) */}
          <div className="mt-[52px] flex">
            <ActivityCol label="KEY ACTIVITIES" items={keyActivities} />
            <ActivityCol label="WALKING TOGETHER" items={together} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OrgCardSection({ cards }: { cards: OrgCard[] }) {
  return (
    <div className="flex flex-col">
      {cards.map((c) => (
        <Card key={c.anchor} {...c} />
      ))}
    </div>
  );
}

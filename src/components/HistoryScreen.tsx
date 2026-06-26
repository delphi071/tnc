"use client";

/* eslint-disable @next/next/no-img-element */

import type { RefObject } from "react";
import { useT } from "@/i18n/useT";

/** Figma "01. 우리의 길 > History" 전체 연혁 (밝은 배경).
 *  peel 로 드러난 뒤, 콘텐츠 전체가 위로 선형 스크롤(2024→2010). */
const STAGE_W = 1920;
// 전체 콘텐츠 높이(디자인). 마지막 2011·2010 이 화면 중앙까지 올라와 활성화되도록 바닥 여백 포함.
export const HISTORY_H = 3980;

export type Ev = { t: string; s?: string };
export type Row = { year: string; y: number; events: Ev[] };

export const ROWS: Row[] = [
  { year: "2024", y: 717, events: [{ t: "‘DMZ평화의길’ 개통", s: "35개 코스, 510km" }, { t: "경기둘레길 노선확대조사" }] },
  { year: "2023", y: 889, events: [{ t: "강화나들길 명품화 연구" }] },
  {
    year: "2022",
    y: 1015,
    events: [
      { t: "‘서해랑길’ 개통", s: "109개 코스, 1,800km" },
      { t: "경기둘레길 통합 운영", s: "2022~현재" },
      { t: "울산 반구대 일원 역사문화탐방로 조성 기본계획" },
      { t: "영월 운탄고도 통합안내센터 관리운영방안 연구" },
      { t: "코리아둘레길 쉼터 운영을 위한 문화관광해설사 역량강화교육" },
    ],
  },
  {
    year: "2020",
    y: 1325,
    events: [
      { t: "‘남파랑길’ 개통", s: "50개 코스, 750km" },
      { t: "코리아둘레길 모니터링 및 안내사무국 운영", s: "2020~현재" },
      { t: "문화재청 명품 세계유산 둘레길 조성" },
      { t: "경기둘레길 관광자원 조사 및 시범구간 조성" },
      { t: "이천 정개산-원적산 및 산수유축제장 둘레길 기본계획 수립" },
      { t: "강릉 걷는 길 종합계획 수립 연구 용역" },
      { t: "KTO-KOICA 공동 안전여행 지킴이 남파랑길 모니터링단 운영" },
    ],
  },
  {
    year: "2019",
    y: 1727,
    events: [
      { t: "경남진주혁신도시 구도심간 역사문화둘레길 기본구상 연구" },
      { t: "경북 고령 대가야 걷는 길 노선개발 및 설계 시공 가이드라인" },
      { t: "남해바래길 모니터링" },
      { t: "해파랑길 모니터링단 교육 / 남해군 코리아둘레길 남해구간 교육" },
      { t: "서울시 문화관광해설사 도보관광코스 현장교육" },
    ],
  },
  { year: "2018", y: 2037, events: [{ t: "경기옛길 신설탐방로 노선조사∙개발∙제안" }, { t: "화성시 화성3.1운동 만세길 모니터링 및 콘텐츠 수집" }] },
  {
    year: "2017",
    y: 2209,
    events: [
      { t: "화성시 독립운동 유허지 정비 및 만세길 조성방안 연구" },
      { t: "산림청 양구DMZ펀치볼둘레길 운영관리방안 연구" },
      { t: "환경부 국가생태문화탐방로 성과평가" },
    ],
  },
  { year: "2016", y: 2427, events: [{ t: "‘해파랑길’ 개통", s: "50개 코스, 750km" }, { t: "코리아둘레길 노선조사" }, { t: "해파랑길 개통 기념 코리아둘레길 컨퍼런스 개최" }] },
  { year: "2015", y: 2645, events: [{ t: "코리아둘레길 기본계획 수립" }, { t: "경기옛길 영남길, 의주길 컨설팅" }] },
  { year: "2013", y: 2817, events: [{ t: "전국걷기길 현황 및 콘텐츠 조사" }, { t: "찾아가는 해파랑길 아카데미" }] },
  {
    year: "2012",
    y: 2989,
    events: [{ t: "‘해파랑길’ 임시 개통 및 홈페이지 오픈", s: "770km, 50개 코스" }, { t: "탐방로 법제화 연구보고서 발간" }, { t: "‘건전한 걷기여행문화 확산방안 워크숍’ 개최" }],
  },
  { year: "2011", y: 3207, events: [{ t: "탐방로 조성 매뉴얼 발간" }] },
  { year: "2010", y: 3333, events: [{ t: "문화생태탐방로 사업 ‘해파랑길’ 노선조사 참여" }, { t: "‘걷기 길, 이대로 괜찮은가?’ 심포지엄 개최" }] },
];

const IMAGES = [
  { src: "hist-2024", x: 320, y: 728, w: 408, h: 260 },
  { src: "hist-namhae", x: 457, y: 1204, w: 271, h: 379 },
  { src: "hist-0418", x: 0, y: 1712, w: 608, h: 306 },
  { src: "hist-0824", x: 434, y: 2301, w: 294, h: 264 },
  { src: "hist-1529", x: 125, y: 3064, w: 505, h: 310 },
];

const ACTIVE = "2024"; // 초기(스크립트 로드 전) 활성 연도
/** 연도 행 y좌표 (OurWayHero 의 활성 연도 계산과 공유, 렌더 순서와 동일) */
export const HISTORY_ROW_Y = ROWS.map((r) => r.y);

export default function HistoryScreen({
  scale,
  contentRef,
}: {
  scale: number;
  contentRef?: RefObject<HTMLDivElement | null>;
}) {
  const h = useT().ourWay.history;
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#f0f0f0]">
      {/* 스크롤되는 전체 콘텐츠 (OurWayHero 가 translateY 로 이동) */}
      <div ref={contentRef} className="absolute left-0 top-0 w-full" style={{ willChange: "transform" }}>
        <div
          className="absolute left-1/2 top-0"
          style={{ width: STAGE_W, height: HISTORY_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
        >
          {/* 섹션 제목 */}
          <p
            className="absolute text-center font-bold text-[#0ac200]"
            style={{ left: 0, right: 0, top: 200, fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}
          >
            History
          </p>
          <p className="absolute text-center font-bold text-black" style={{ left: 360, right: 360, top: 359, fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.32px" }}>
            {h.subtitle}
          </p>
          <div className="absolute text-center text-[#5a5b5d]" style={{ left: 0, right: 0, top: 446, fontSize: 18, lineHeight: 1.45, letterSpacing: "-0.36px" }}>
            {h.intro.map((line, i) => (
              <p key={i}>{line === "" ? " " : line}</p>
            ))}
          </div>

          {/* 세로선 (마지막 2010 아래까지 연장) */}
          <div className="absolute bg-[#d9d9d9]" style={{ left: 961, top: 737, width: 2, height: 2760 }} />
          {/* 활성 연도 녹색 점 (스크롤에 따라 이동) */}
          <span
            data-history-dot
            className="absolute rounded-full bg-[#0ac200] transition-[top] duration-200"
            style={{ left: 951, top: 726, width: 22, height: 22 }}
          />

          {/* 연도별 이미지 */}
          {IMAGES.map((im) => (
            <div
              key={im.src}
              className="absolute overflow-hidden"
              style={{ left: im.x, top: im.y, width: im.w, height: im.h, borderTopLeftRadius: 50, borderBottomRightRadius: 50 }}
            >
              <img src={`/intro/${im.src}.jpg`} alt="" className="h-full w-full object-cover" />
            </div>
          ))}

          {/* 연도 + 이벤트 (활성 연도는 data-active 로 토글) */}
          {ROWS.map((row) => (
            <div
              key={row.year}
              data-hist-row
              data-active={row.year === ACTIVE ? "true" : "false"}
              className="hist-row absolute"
              style={{ top: row.y, left: 0, right: 0 }}
            >
              <p
                className="hist-year absolute text-right font-bold"
                style={{ left: 795, width: 140, fontSize: 40, lineHeight: 1, fontFamily: "var(--font-montserrat)" }}
              >
                {row.year}
              </p>
              <div className="absolute" style={{ left: 1015, width: 700 }}>
                {row.events.map((e, j) => (
                  <div key={j} className="flex items-baseline gap-3 whitespace-nowrap" style={{ height: 46 }}>
                    <span className="hist-ev" style={{ fontSize: 16, fontWeight: 700 }}>{e.t}</span>
                    {e.s && <span className="hist-sub" style={{ fontSize: 14 }}>{e.s}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

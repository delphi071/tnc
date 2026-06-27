"use client";

import type { RefObject } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** Figma "01. 우리의 길 > People(조직도)" 전체.
 *  이사장 → 감사 / 이사진(7인) → 사무처 → 3팀. peel 로 드러난 뒤 선형 스크롤. */
const STAGE_W = 1920;
export const ORG_H = 1540; // 전체 조직도 높이(디자인)
const GREEN = "#0ac200";

export const ROW1 = [
  { n: "권다현", r: "여행작가" },
  { n: "윤정준", r: "스튜디오 날다 대표" },
  { n: "박희진", r: "여강길 사무국장" },
  { n: "최정윤", r: "어반시냅스 대표" },
];
export const ROW2 = [
  { n: "신정섭", r: "(사)한국생태문화연구소장" },
  { n: "강인숙", r: "(주)트래블디자인 대표이사" },
  { n: "강미희", r: "GSTC 아시아태평양소장" },
];
export const TEAMS = [
  { name: "탐방로팀", items: ["코리아둘레길 사업", "연구사업", "컨설팅 사업"] },
  { name: "문화콘텐츠팀", items: ["콘텐츠 사업", "교육사업", "교류사업"] },
  { name: "운영지원팀", items: ["조직관리", "홍보마케팅", "협의체 관리"] },
];

/** 영문 조직도 (Figma EN, node 1562-17738~17805) — KO 와 1:1 대응 */
export const ROW1_EN = [
  { n: "Dahyun Kwon", r: "Travel Writer" },
  { n: "Jeongjun Yun", r: "CEO, Studio Nalda" },
  { n: "Heejin Park", r: "Director, Yeogang-gil" },
  { n: "Jeongyun Choi", r: "CEO, Urban Synapse" },
];
export const ROW2_EN = [
  { n: "Jungseop Shin", r: "Director, Korea Institute of Ecological Culture" },
  { n: "Insook Kang", r: "CEO, TravelDesign" },
  { n: "Mihee Kang", r: "Director, GSTC APAC" },
];
export const TEAMS_EN = [
  { name: "Trail Team", items: ["Korea Dullegil Project", "Research & Development", "Consulting Services"] },
  { name: "Culture & Content Team", items: ["Content Development", "Educational Programs", "Networking"] },
  { name: "Operations Support Team", items: ["HR & Administration", "PR & Marketing", "Partnership Management"] },
];

/** 직책 라벨·이름·안내문 (한/영) */
export const ORG_LABELS = {
  ko: {
    chair: "이사장", chairName: "홍성운",
    auditor: "감사", auditorName: "전영길 회계사",
    board: "이사진", secretariat: "사무처",
    note: "이사회는 (사)한국의길과문화의 사업과 운영에 관한 사항을 심의, 의결합니다.",
  },
  en: {
    chair: "Chair", chairName: "Seongwoon Hong",
    auditor: "Auditor", auditorName: "Younggil Jeon",
    board: "Board of Directors", secretariat: "Secretariat",
    note: "The Board reviews and resolves matters on operations and projects.",
  },
} as const;

export default function OrgChartScreen({
  scale,
  contentRef,
}: {
  scale: number;
  contentRef?: RefObject<HTMLDivElement | null>;
}) {
  const subtitle = useT().ourWay.people.subtitle;
  const en = useLocale().locale === "en";
  const L = en ? ORG_LABELS.en : ORG_LABELS.ko;
  const row1 = en ? ROW1_EN : ROW1;
  const row2 = en ? ROW2_EN : ROW2;
  const teams = en ? TEAMS_EN : TEAMS;
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#f0f0f0]">
      <div ref={contentRef} className="absolute left-0 top-0 w-full" style={{ willChange: "transform" }}>
        <div className="absolute left-1/2 top-0" style={{ width: STAGE_W, height: ORG_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}>
          {/* 제목 */}
          <p className="absolute text-center font-bold text-[#0ac200]" style={{ left: 0, right: 0, top: 150, fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}>
            People
          </p>
          <p className="absolute text-center font-bold text-black" style={{ left: 0, right: 0, top: 205, fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.32px" }}>
            {subtitle}
          </p>

          {/* 점선 연결 */}
          <svg viewBox={`0 0 ${STAGE_W} ${ORG_H}`} className="pointer-events-none absolute inset-0 h-full w-full" fill="none">
            {/* 이사장 → 이사진 + 감사 분기 */}
            <line x1="960" y1="436" x2="960" y2="588" stroke="#0ac200" strokeWidth="1.5" strokeDasharray="2 6" />
            <line x1="960" y1="500" x2="1116" y2="500" stroke="#0ac200" strokeWidth="1.5" strokeDasharray="2 6" />
            {/* 사무처 → 3팀 */}
            <line x1="960" y1="1086" x2="960" y2="1140" stroke="#0ac200" strokeWidth="1.5" strokeDasharray="2 6" />
            <line x1="622" y1="1140" x2="1298" y2="1140" stroke="#0ac200" strokeWidth="1.5" strokeDasharray="2 6" />
            <line x1="622" y1="1140" x2="622" y2="1191" stroke="#0ac200" strokeWidth="1.5" strokeDasharray="2 6" />
            <line x1="960" y1="1140" x2="960" y2="1191" stroke="#0ac200" strokeWidth="1.5" strokeDasharray="2 6" />
            <line x1="1298" y1="1140" x2="1298" y2="1191" stroke="#0ac200" strokeWidth="1.5" strokeDasharray="2 6" />
            {/* 사무처 분기 점 — 팀 박스 외곽선이 아니라 헤더 "안쪽"에 위치 (Figma Ellipse 49/50/51) */}
            <circle cx="622" cy="1191" r="4.5" fill="#0ac200" />
            <circle cx="960" cy="1191" r="4.5" fill="#0ac200" />
            <circle cx="1298" cy="1191" r="4.5" fill="#0ac200" />
          </svg>

          {/* 이사장 */}
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center gap-3 rounded-full text-white" style={{ top: 388, width: 311, paddingTop: 18, paddingBottom: 18, backgroundColor: GREEN }}>
            <span className="font-extrabold" style={{ fontSize: 18 }}>{L.chair}</span>
            <span style={{ fontSize: 18 }}>{L.chairName}</span>
          </div>
          {/* 감사 */}
          <div className="absolute flex items-center justify-center gap-3 rounded-full text-white" style={{ left: 1116, top: 471, width: 311, paddingTop: 18, paddingBottom: 18, backgroundColor: GREEN }}>
            <span className="font-extrabold" style={{ fontSize: 18 }}>{L.auditor}</span>
            <span style={{ fontSize: 18 }}>{L.auditorName}</span>
          </div>

          {/* 이사진 + 7인 + 안내 */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 588, width: 1000 }}>
            <div className="flex items-center justify-center rounded-full text-center text-white" style={{ paddingTop: 18, paddingBottom: 18, backgroundColor: GREEN }}>
              <span className="font-extrabold" style={{ fontSize: 18 }}>{L.board}</span>
            </div>
            <div className="mt-[34px] flex flex-col gap-[26px]">
              <div className="flex gap-6">
                {row1.map((m) => (
                  <div key={m.n} className="flex flex-1 items-center justify-center rounded-full border text-center" style={{ borderColor: GREEN, color: GREEN, paddingTop: 18, paddingBottom: 18 }}>
                    <p style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.72px" }}>{m.n}<br />{m.r}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-6">
                {row2.map((m) => (
                  <div key={m.n} className="flex flex-1 items-center justify-center rounded-full border text-center" style={{ borderColor: GREEN, color: GREEN, paddingTop: 18, paddingBottom: 18 }}>
                    <p style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.72px" }}>{m.n}<br />{m.r}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-[34px] text-center text-black" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.72px" }}>
              {L.note}
            </p>
          </div>

          {/* 사무처 */}
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full text-center text-white" style={{ top: 1028, width: 1000, paddingTop: 18, paddingBottom: 18, backgroundColor: GREEN }}>
            <span className="font-extrabold" style={{ fontSize: 18 }}>{L.secretariat}</span>
          </div>

          {/* 3팀 */}
          <div className="absolute left-1/2 flex -translate-x-1/2 gap-[14px]" style={{ top: 1182, width: 1000 }}>
            {teams.map((t) => (
              <div key={t.name} className="flex flex-1 flex-col">
                <div className="flex items-center justify-center border border-b-0 py-5" style={{ borderColor: GREEN, borderTopLeftRadius: 34, borderTopRightRadius: 34 }}>
                  <span className="font-bold" style={{ color: GREEN, fontSize: 18 }}>{t.name}</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 border py-6" style={{ borderColor: GREEN, borderBottomLeftRadius: 34, borderBottomRightRadius: 34 }}>
                  {t.items.map((it) => (
                    <p key={it} style={{ color: GREEN, fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.72px" }}>{it}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

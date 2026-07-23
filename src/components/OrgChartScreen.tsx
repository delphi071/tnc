"use client";

import type { RefObject } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** Figma "01. 우리의 길 > People(조직도)" 전체 (node 1364:6987 / EN 1562:17479 재설계본).
 *  이사장 → 감사 / [운영위원회(좌·5인 세로) · 이사진(우·4인 세로)] → 사무처 → 3팀.
 *  두 그룹이 좌우 2단으로 나뉘고 가운데 세로 연결선으로 잇는다. peel 로 드러난 뒤 선형 스크롤. */
const STAGE_W = 1920;
const GREEN = "#0ac200";

/** 2단 트리 기하(스테이지 좌표). 트리 폭 1000, 가운데(x960) 정렬.
 *  좌 열(운영위원회) 460~880, 우 열(이사진) 1040~1460, 각 폭 420. */
const COL_W = 420;
const LEFT_X = 460;   // 운영위원회 열
const RIGHT_X = 1040; // 이사진 열
const COLS_TOP = 722; // 두 그룹 라벨 상단
const CHAIR_TOP = 456;
const AUDITOR_TOP = 589;
const SECRETARIAT_Y = 1353;
const TEAMS_Y = 1558;

/** 연결선(가운데 세로 스파인 + 분기) */
const SPINE_X = 960;
const SPINE_TOP = 524;         // 이사장 pill 하단
const AUDITOR_BRANCH_Y = 623;  // 감사 pill 세로 중앙
const LABEL_BRANCH_Y = 756;    // 운영위·이사진 라벨 세로 중앙
/** 사무처 → 3팀 분기 */
const SEC_BOTTOM = SECRETARIAT_Y + 66;   // 사무처 pill 하단
const BUS_Y = SEC_BOTTOM + 81;           // 가로 분기선
const DOT_Y = TEAMS_Y + 9;               // 팀 헤더 안쪽 분기점
const TEAM_DOTS_X = [622, 960, 1298];    // 3팀 헤더 중앙

export const ORG_H = 1966; // 전체 조직도 높이(Figma Frame 493)

/** 이사진 4인 (Figma KO 1364:7031) */
export const BOARD = [
  { n: "강미희", r: "GSTC 아시아태평양소장" },
  { n: "권다현", r: "여행작가" },
  { n: "박희진", r: "여강길 사무국장" },
  { n: "최정윤", r: "어반시냅스 대표" },
];
/** 운영위원회 5인 — 3인 + 2인 두 줄 (Figma KO 1712:5214 / 1364:7040) */
export const COMMITTEE1 = [
  { n: "김수남", r: "주민공정여행사 팜팜 대표" },
  { n: "선주성", r: "둔내건강학교 교장" },
  { n: "조성연", r: "지속가능한관광도시관광연구소 대표" },
];
export const COMMITTEE2 = [
  { n: "조은영", r: "여행매거진 [MOVE] 발행인 겸 편집장" },
  { n: "최윤현", r: "주식회사 문화기획3456 대표" },
];
export const TEAMS = [
  { name: "탐방로팀", items: ["코리아둘레길 사업", "연구사업", "컨설팅 사업"] },
  { name: "문화콘텐츠팀", items: ["콘텐츠 사업", "교육사업", "교류사업"] },
  { name: "운영지원팀", items: ["조직관리", "홍보마케팅", "협의체 관리"] },
];

/** 영문 조직도 (Figma EN, node 1754:23698) — 이름/직함 2줄, 줄바꿈은 Figma 그대로 (n=1행, r=2행) */
export const BOARD_EN = [
  { n: "Mi-hee Kang", r: "GSTC Asia-Pacific Director" },
  { n: "Da-hyun Kwon", r: "Travel Writer" },
  { n: "Hee-jin Park", r: "Yeogang-gil Secretary General" },
  { n: "Jeong-yun Choi", r: "Urban Synapse CEO" },
];
/** 줄바꿈은 Figma 그대로 — Seong-yeon Jo 만 "CEO,"가 1행 끝(이름)에 붙는다 */
export const COMMITTEE1_EN = [
  { n: "Su-nam Kim", r: "CEO, FarmFarm Community Fair Travel" },
  { n: "Ju-seong Seon", r: "Principal, Dunnae Health School" },
  { n: "Seong-yeon Jo CEO,", r: "Sustainable Tourism Institute" },
];
export const COMMITTEE2_EN = [
  { n: "Eun-yeong Jo", r: "Editor-in-Chief, MOVE" },
  { n: "Yun-hyun Choi", r: "CEO, Culture Planning 3456 Co., Ltd." },
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
    board: "이사진", committee: "운영위원회", secretariat: "사무처",
    note: "이사회는 (사)한국의길과문화의 사업과 운영에 관한 사항을 심의, 의결합니다.",
  },
  en: {
    chair: "Chairperson", chairName: "Seong-un Hong",
    auditor: "Auditor", auditorName: "Yeong-gil Jeon, CPA",
    board: "Board of Directors", committee: "Executive Committee", secretariat: "Secretariat",
    note: "The Board of Directors deliberates and resolves matters regarding the projects and operations of Korea Trails & Culture.",
  },
} as const;

/** 초록 배경 그룹 라벨 pill (이사진 / 운영위원회 / 사무처) */
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-full text-center text-white" style={{ paddingTop: 24, paddingBottom: 24, backgroundColor: GREEN }}>
      <span className="font-extrabold" style={{ fontSize: 18, lineHeight: 1.1 }}>{children}</span>
    </div>
  );
}

/** 멤버 pill (초록 외곽선) — 이름 / 직함 두 줄 */
function MemberPill({ n, r }: { n: string; r: string }) {
  return (
    <div className="flex items-center justify-center rounded-full border text-center" style={{ borderColor: GREEN, color: GREEN, paddingTop: 18, paddingBottom: 18 }}>
      <p style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.72px" }}>{n}<br />{r}</p>
    </div>
  );
}

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
  const board = en ? BOARD_EN : BOARD;
  // 운영위원회는 이제 한 열에 세로로 쌓이므로 3인+2인을 한 목록으로 합친다.
  const committee = en ? [...COMMITTEE1_EN, ...COMMITTEE2_EN] : [...COMMITTEE1, ...COMMITTEE2];
  const teams = en ? TEAMS_EN : TEAMS;
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#f0f0f0]">
      <div ref={contentRef} className="absolute left-0 top-0 w-full" style={{ willChange: "transform" }}>
        <div className="absolute left-1/2 top-0" style={{ width: STAGE_W, height: ORG_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}>
          {/* 제목 */}
          <p className="absolute text-center font-bold text-[#0ac200]" style={{ left: 0, right: 0, top: 200, fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}>
            People
          </p>
          <p className="absolute text-center font-bold text-black" style={{ left: 0, right: 0, top: 269, fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.32px" }}>
            {subtitle}
          </p>

          {/* 점선 연결 */}
          <svg viewBox={`0 0 ${STAGE_W} ${ORG_H}`} className="pointer-events-none absolute inset-0 h-full w-full" fill="none">
            {/* 가운데 세로 스파인 (이사장 → 사무처) */}
            <line x1={SPINE_X} y1={SPINE_TOP} x2={SPINE_X} y2={SECRETARIAT_Y} stroke={GREEN} strokeWidth="1.5" strokeDasharray="2 6" />
            {/* 감사 분기 */}
            <line x1={SPINE_X} y1={AUDITOR_BRANCH_Y} x2={RIGHT_X} y2={AUDITOR_BRANCH_Y} stroke={GREEN} strokeWidth="1.5" strokeDasharray="2 6" />
            {/* 운영위원회·이사진 라벨 분기 (좌 열 우측끝 ↔ 우 열 좌측끝) */}
            <line x1={LEFT_X + COL_W} y1={LABEL_BRANCH_Y} x2={RIGHT_X} y2={LABEL_BRANCH_Y} stroke={GREEN} strokeWidth="1.5" strokeDasharray="2 6" />
            {/* 사무처 → 3팀 */}
            <line x1={SPINE_X} y1={SEC_BOTTOM} x2={SPINE_X} y2={BUS_Y} stroke={GREEN} strokeWidth="1.5" strokeDasharray="2 6" />
            <line x1={TEAM_DOTS_X[0]} y1={BUS_Y} x2={TEAM_DOTS_X[2]} y2={BUS_Y} stroke={GREEN} strokeWidth="1.5" strokeDasharray="2 6" />
            {TEAM_DOTS_X.map((x) => (
              <line key={x} x1={x} y1={BUS_Y} x2={x} y2={DOT_Y} stroke={GREEN} strokeWidth="1.5" strokeDasharray="2 6" />
            ))}
            {TEAM_DOTS_X.map((x) => (
              <circle key={`d${x}`} cx={x} cy={DOT_Y} r="4.5" fill={GREEN} />
            ))}
          </svg>

          {/* 이사장 (가운데) */}
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center gap-[10px] rounded-full text-white" style={{ top: CHAIR_TOP, width: 400, paddingTop: 24, paddingBottom: 24, backgroundColor: GREEN }}>
            <span className="font-extrabold" style={{ fontSize: 18, lineHeight: 1.1 }}>{L.chair}</span>
            <span style={{ fontSize: 18, lineHeight: 1.1 }}>{L.chairName}</span>
          </div>
          {/* 감사 (우) */}
          <div className="absolute flex items-center justify-center gap-[10px] rounded-full text-white" style={{ left: RIGHT_X, top: AUDITOR_TOP, width: COL_W, paddingTop: 24, paddingBottom: 24, backgroundColor: GREEN }}>
            <span className="font-extrabold" style={{ fontSize: 18, lineHeight: 1.1 }}>{L.auditor}</span>
            <span style={{ fontSize: 18, lineHeight: 1.1 }}>{L.auditorName}</span>
          </div>

          {/* 운영위원회 (좌 열, 5인 세로) */}
          <div className="absolute flex flex-col gap-[14px]" style={{ left: LEFT_X, top: COLS_TOP, width: COL_W }}>
            <GroupLabel>{L.committee}</GroupLabel>
            {committee.map((m) => (
              <MemberPill key={m.n} n={m.n} r={m.r} />
            ))}
          </div>

          {/* 이사진 (우 열, 4인 세로) + 안내문 */}
          <div className="absolute flex flex-col gap-[14px]" style={{ left: RIGHT_X, top: COLS_TOP, width: COL_W }}>
            <GroupLabel>{L.board}</GroupLabel>
            {board.map((m) => (
              <MemberPill key={m.n} n={m.n} r={m.r} />
            ))}
            <p className="mt-[20px] text-center text-black" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.72px" }}>
              {L.note}
            </p>
          </div>

          {/* 사무처 */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: SECRETARIAT_Y, width: 1000 }}>
            <GroupLabel>{L.secretariat}</GroupLabel>
          </div>

          {/* 3팀 */}
          <div className="absolute left-1/2 flex -translate-x-1/2 gap-[14px]" style={{ top: TEAMS_Y, width: 1000 }}>
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

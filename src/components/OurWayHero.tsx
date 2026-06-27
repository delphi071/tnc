"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";
import Header from "./Header";
import MissionScreen from "./MissionScreen";
import VisionScreen from "./VisionScreen";
import CoreValueScreen, { CV_DEPTH } from "./CoreValueScreen";
import HistoryScreen, { HISTORY_H, HISTORY_ROW_Y } from "./HistoryScreen";
import OrgChartScreen, { ORG_H } from "./OrgChartScreen";
import MapScreen from "./MapScreen";
import SiteFooter from "./SiteFooter";
import SectionNavLabel from "./SectionNavLabel";
import OurWayMobile from "./OurWayMobile";

/** Figma 디자인 기준 좌표계 (01. 우리의 길 main-1~3) */
const STAGE_W = 1920;
const STAGE_H = 1084;

/** 스크롤 길이: 10단계 (핀 고정) + 이후 footer 일반 스크롤 */
const TRACK_VH = 1700;
/** 진행도 분기 (0→1):
 *  [0~P1] 선 / [P1~P2] Mission 덮음 / [P2~P3] Mission 걷혀 Vision
 *  [P3~P4] Vision 걷혀 Core Value / [P4~P5] 큐브 / [P5~P6] Core Value 걷혀 History
 *  [P6~P7] 연혁 스크롤 / [P7~P8] History 걷혀 조직도 / [P8~P9] 조직도 스크롤(사무처·3팀)
 *  [P9~1] 조직도 걷혀(peel) 약도 드러남. (이후 트랙 종료 → footer 일반 스크롤) */
const P1 = 0.09;
const P2 = 0.18;
const P3 = 0.27;
const P4 = 0.35;
const P5 = 0.47;
const P6 = 0.54;
const P7 = 0.74;
const P8 = 0.81;
const P9 = 0.92;
/** 큐브 단계당 머무는(dwell) 비율 — 값이 잠시 멈춘 뒤 다음으로 회전 */
const CUBE_HOLD = 0.5;

/** 선의 세로 획 x좌표 (디자인 스테이지 좌표 기준, Figma 측정값) */
const LEFT_X = 966; // Beyond 의 d
const RIGHT_X = 901; // the 의 h (오른쪽으로 1px 보정)

/** 테스트용: 선을 처음부터 끝까지 보이게 (튜닝 후 false) */
const SHOW_FULL = false;

/** 푸터 서브메뉴 → 섹션 스크롤 진행도(0~1). 해시(#키)로 해당 섹션 위치로 점프 */
// 각 섹션이 "정착"하는 위상 경계(translateY 0, 컨텐츠가 설계 위치)에 맞춘다.
// mission=P2, vision=P3, history=P6(연혁 시작), people=P8(조직도 시작), location=P9.
const SECTION_PROGRESS: Record<string, number> = {
  mission: 0.18,
  vision: 0.27,
  history: 0.54,
  people: 0.81,
  location: 1, // phase10 끝(조직도 완전히 걷힘) — 이전 섹션 잔상 없이 약도만
};

export default function OurWayHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<SVGPathElement>(null);
  const lineRightRef = useRef<SVGPathElement>(null);
  const heroFgRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const historyContentRef = useRef<HTMLDivElement>(null);
  const orgRef = useRef<HTMLDivElement>(null);
  const orgContentRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const headerLightRef = useRef(false);

  const t = useT();
  const [scale, setScale] = useState(1);
  const [headerLight, setHeaderLight] = useState(false);
  const [mobileHeaderLight, setMobileHeaderLight] = useState(false); // 모바일 카드 스택의 밝은 섹션 여부
  const leftX = LEFT_X;
  const rightX = RIGHT_X;

  // 진입 시: 해시(#섹션)면 해당 섹션으로, 아니면 맨 위(1단계). 같은 페이지 해시 변경도 처리
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const scrollToSection = () => {
      const track = trackRef.current;
      if (!track) return false;
      const total = track.offsetHeight - window.innerHeight;
      if (total <= 0) return false; // 트랙이 숨겨짐(모바일 lg 미만) → 모바일 카드스택이 처리
      const p = SECTION_PROGRESS[window.location.hash.slice(1)];
      if (p == null) return false;
      window.scrollTo(0, track.offsetTop + p * total);
      return true;
    };
    requestAnimationFrame(() => {
      const track = trackRef.current;
      const visible = track ? track.offsetHeight - window.innerHeight > 0 : false;
      if (!scrollToSection() && visible) window.scrollTo(0, 0);
    });
    window.addEventListener("hashchange", scrollToSection);
    return () => window.removeEventListener("hashchange", scrollToSection);
  }, []);

  // 화면 폭에 맞춰 스테이지 균일 축소 (1920 초과 시 1.0 유지 → 가운데 정렬)
  useEffect(() => {
    const onResize = () => setScale(Math.min(1, window.innerWidth / STAGE_W));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 스크롤 진행도(0→1)로 선을 그려나감
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;
      const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
      // 1단계: 선 그리기
      const lineP = clamp01(progress / P1);
      // 2단계: Mission 슬라이드업 (밑 → 덮음)
      const slideUpP = clamp01((progress - P1) / (P2 - P1));
      // 3단계: Mission 이 위로 걷히며 Vision 노출
      const revealMP = clamp01((progress - P2) / (P3 - P2));
      // 4단계: Vision 이 위로 걷히며 Core Value 노출
      const revealVP = clamp01((progress - P3) / (P4 - P3));
      // 5단계: Core Value 값 큐브 회전 (0→3 = 4개 면)
      // 각 단계마다 dwell(머무름) 후 부드럽게 회전 → 연달아 나오지 않고 여유 있게
      const cubeP = clamp01((progress - P4) / (P5 - P4));
      const seg = cubeP * 3;
      const ci = Math.min(Math.floor(seg), 2);
      const cf = seg - ci;
      const ct = cf <= CUBE_HOLD ? 0 : (cf - CUBE_HOLD) / (1 - CUBE_HOLD);
      const cubeStep = ci + ct * ct * (3 - 2 * ct); // smoothstep
      // 6단계: Core Value 가 위로 걷히며(peel) History 노출
      const peelP = clamp01((progress - P5) / (P6 - P5));
      // 7단계: History 전체 연혁 선형 스크롤
      const historyScrollP = clamp01((progress - P6) / (P7 - P6));
      // 8단계: History 가 위로 걷혀(peel) 조직도 노출
      const historyPeelP = clamp01((progress - P7) / (P8 - P7));
      // 9단계: 조직도 선형 스크롤 (사무처·3팀)
      const orgScrollP = clamp01((progress - P8) / (P9 - P8));
      // 10단계: 조직도 걷혀(peel) 약도 노출
      const orgPeelP = clamp01((progress - P9) / (1 - P9));

      // Mission: 2단계 100%→0, 3단계 0→-100%
      const missionTY = (1 - slideUpP) * 100 - revealMP * 100;
      // Vision: 4단계 0→-100%
      const visionTY = -revealVP * 100;
      // Core Value: 6단계 0→-100% (peel)
      const coreTY = -peelP * 100;

      const offset = SHOW_FULL ? "0" : String(1 - lineP);
      if (lineLeftRef.current) lineLeftRef.current.style.strokeDashoffset = offset;
      if (lineRightRef.current) lineRightRef.current.style.strokeDashoffset = offset;
      // 히어로 전경(선·헤드라인·설명·라벨)은 Mission 슬라이드업에 맞춰 위로 peel (배경 고정)
      if (heroFgRef.current) heroFgRef.current.style.transform = `translateY(${-slideUpP * 100}%)`;
      if (missionRef.current) missionRef.current.style.transform = `translateY(${missionTY}%)`;
      // Vision: Mission 이 덮은 뒤(2단계 종료)부터 뒤에 존재, 4단계에 위로 걷힘
      if (visionRef.current) {
        visionRef.current.style.opacity = slideUpP >= 1 ? "1" : "0";
        visionRef.current.style.transform = `translateY(${visionTY}%)`;
      }
      // Core Value: Vision 이 덮은 뒤(3단계 종료)부터 뒤에 존재 → 4단계에 드러남, 6단계에 peel
      if (coreRef.current) {
        coreRef.current.style.opacity = revealMP >= 1 ? "1" : "0";
        coreRef.current.style.transform = `translateY(${coreTY}%)`;
      }
      // 5단계: 값 큐브 회전
      if (cubeRef.current) {
        cubeRef.current.style.transform = `translateZ(-${CV_DEPTH}px) rotateX(${cubeStep * 90}deg)`;
      }
      // History: Core Value 가 큐브를 마친 뒤(5단계 종료)부터 뒤에 존재, 8단계엔 위로 걷힘(peel)
      if (historyRef.current) {
        historyRef.current.style.opacity = cubeP >= 1 ? "1" : "0";
        historyRef.current.style.transform = `translateY(${-historyPeelP * 100}%)`;
      }
      // 조직도: History 스크롤이 끝난 뒤(7단계 종료)부터 뒤에 존재 → 8단계 peel, 10단계엔 위로 걷힘
      if (orgRef.current) {
        orgRef.current.style.opacity = historyScrollP >= 1 ? "1" : "0";
        orgRef.current.style.transform = `translateY(${-orgPeelP * 100}%)`;
      }
      // 9단계: 조직도 콘텐츠 선형 스크롤 (사무처·3팀까지)
      if (orgContentRef.current) {
        const sc = Math.min(1, window.innerWidth / STAGE_W);
        const orgMax = Math.max(ORG_H * sc - window.innerHeight, 0);
        orgContentRef.current.style.transform = `translateY(${-orgScrollP * orgMax}px)`;
      }
      // 약도: 조직도 스크롤이 끝난 뒤(9단계 종료)부터 뒤에 존재 → 10단계 peel 로 드러남
      if (mapRef.current) mapRef.current.style.opacity = orgScrollP >= 1 ? "1" : "0";
      // 7단계: History 콘텐츠 선형 스크롤 (2024 → 2010)
      if (historyContentRef.current) {
        const sc = Math.min(1, window.innerWidth / STAGE_W);
        const maxScroll = Math.max(HISTORY_H * sc - window.innerHeight, 0);
        const ty = -historyScrollP * maxScroll;
        historyContentRef.current.style.transform = `translateY(${ty}px)`;

        // 화면 세로 중앙에 가장 가까운 연도 = 활성
        const center = window.innerHeight / 2;
        let activeI = 0;
        let best = Infinity;
        for (let i = 0; i < HISTORY_ROW_Y.length; i++) {
          const sy = ty + HISTORY_ROW_Y[i] * sc;
          const d = Math.abs(sy - center);
          if (d < best) {
            best = d;
            activeI = i;
          }
        }
        const rows = historyContentRef.current.querySelectorAll<HTMLElement>("[data-hist-row]");
        rows.forEach((row, i) => {
          const on = i === activeI;
          const y = row.querySelector<HTMLElement>(".hist-year");
          if (y) y.style.color = on ? "#000000" : "#a8a8a8";
          row.querySelectorAll<HTMLElement>(".hist-ev").forEach((e) => (e.style.color = on ? "#111111" : "#8f9092"));
          row.querySelectorAll<HTMLElement>(".hist-sub").forEach((e) => (e.style.color = on ? "#5a5b5d" : "#b0b1b3"));
        });
        const dot = historyContentRef.current.querySelector<HTMLElement>("[data-history-dot]");
        if (dot) dot.style.top = `${HISTORY_ROW_Y[activeI] + 9}px`;
      }

      // 헤더 테마: Vision 이 거의 다 걷혀 밝은 Core Value 가 상단을 채우면 밝은 테마로
      const wantLight = revealVP >= 0.92;
      if (headerLightRef.current !== wantLight) {
        headerLightRef.current = wantLight;
        setHeaderLight(wantLight);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // 측정된 글자 중심을 기준으로 선 경로 생성 (세로 획 → 둥근 모서리 → 화면 끝까지)
  const lineLeft = `M${leftX} 474 V327 C${leftX} 290 ${leftX - 31} 260 ${leftX - 70} 260 H0`;
  const lineRight = `M${rightX} 588 V678 C${rightX} 714 ${rightX + 31} 744 ${rightX + 70} 744 H1920`;

  return (
    <>
      {/* 페이지 전체에 고정되는 헤더 (메뉴는 항상 떠 있음, 밝은 섹션에서 테마 전환) */}
      <Header active="ourWay" fixed theme={headerLight || mobileHeaderLight ? "light" : "dark"} />

      {/* 모바일(lg 미만) 전용 본문 — peel 스크롤(Hero → Mission → …) */}
      <OurWayMobile onLightChange={setMobileHeaderLight} />

      {/* 데스크톱 스크롤 트랙 (lg+) — 모바일에서는 숨김 */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${TRACK_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* 배경 (풀블리드) */}
        <Image
          src="/intro/bg-1-v2.jpg"
          alt="우리의 길"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/40 to-transparent" />

        {/* 1920 좌표 스테이지 (균일 스케일, 가운데 정렬) */}
        <div
          className="absolute left-1/2 top-1/2 z-10"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <div ref={heroFgRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          {/* 늘어나는 선 */}
          <svg
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            fill="none"
          >
            <path
              ref={lineLeftRef}
              d={lineLeft}
              stroke="#0ac200"
              strokeWidth={18.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: SHOW_FULL ? 0 : 1 }}
            />
            <path
              ref={lineRightRef}
              d={lineRight}
              stroke="#0ac200"
              strokeWidth={18.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: SHOW_FULL ? 0 : 1 }}
            />
          </svg>

          {/* 헤드라인 (계단식) — d / h 글자는 선 정렬용 측정 대상 */}
          <span
            className="absolute font-extrabold text-[#0ac200]"
            style={{ left: 574, top: 378, fontSize: 100, lineHeight: 1.5, fontFamily: "var(--font-montserrat)" }}
          >
            Beyond
          </span>
          <span
            className="absolute font-extrabold text-[#0ac200]"
            style={{ left: 802, top: 479, fontSize: 100, lineHeight: 1.5, fontFamily: "var(--font-montserrat)" }}
          >
            the Route
          </span>

          {/* 설명 */}
          <div className="absolute flex flex-col gap-6 text-white" style={{ left: 1017, top: 622 }}>
            <p className="font-extrabold" style={{ fontSize: 24, lineHeight: 0.9, letterSpacing: "-1.2px" }}>
              {t.ourWay.hero.title}
            </p>
            <div style={{ fontSize: 18, letterSpacing: "-0.72px", lineHeight: 1.45 }}>
              {t.ourWay.hero.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          </div>
        </div>

        {/* 좌우 섹션 네비 (스테이지 밖, 고정 크기) — reveal 화면(z 10~16)보다 낮은 z=9 로 깔아 콘텐츠에 가려지게 */}
        {/* 좌측 라벨 (마지막 섹션: 마음잇기로 순환) */}
        <SectionNavLabel side="left" lines={["WALK", "WITH US"]} href="/walk-with-us" z={9} />
        {/* 우측 라벨 (다음 섹션: 같은 길, 다른 시선) */}
        <SectionNavLabel side="right" lines={["SAME TRAIL,", "NEW VISION"]} href="/same-trail" z={9} />

        {/* 맨 뒤에 고정되는 History — 6단계에서 Core Value 가 걷히며 드러남 */}
        {/* 약도(Location) — 10단계에서 조직도가 걷히며 드러남 (hero 와 같은 z, DOM 뒤라 위에 표시) */}
        <div ref={mapRef} className="pointer-events-none absolute inset-0 z-[10]" style={{ opacity: 0 }}>
          <MapScreen />
        </div>

        {/* 조직도(People) — 8단계에 드러나고, 10단계엔 위로 걷힘(peel) */}
        <div
          ref={orgRef}
          className="pointer-events-none absolute inset-0 z-[11]"
          style={{ opacity: 0, transform: "translateY(0%)", willChange: "transform, opacity", boxShadow: "0 26px 50px -10px rgba(0,0,0,0.28)" }}
        >
          <OrgChartScreen scale={scale} contentRef={orgContentRef} />
        </div>

        <div
          ref={historyRef}
          className="pointer-events-none absolute inset-0 z-[12]"
          style={{ opacity: 0, transform: "translateY(0%)", willChange: "transform, opacity", boxShadow: "0 26px 50px -10px rgba(0,0,0,0.28)" }}
        >
          <HistoryScreen scale={scale} contentRef={historyContentRef} />
        </div>

        {/* Core Value(밝은 배경) — 4단계에 드러나고, 6단계엔 위로 걷힘(peel) */}
        <div
          ref={coreRef}
          className="pointer-events-none absolute inset-0 z-[14]"
          style={{ opacity: 0, transform: "translateY(0%)", willChange: "transform, opacity", boxShadow: "0 26px 50px -10px rgba(0,0,0,0.28)" }}
        >
          <CoreValueScreen scale={scale} cubeRef={cubeRef} />
        </div>

        {/* Vision — 3단계에 Mission 이 걷히며 드러나고, 4단계엔 자신이 위로 걷힘 */}
        <div
          ref={visionRef}
          className="pointer-events-none absolute inset-0 z-[16]"
          style={{ opacity: 0, transform: "translateY(0%)", willChange: "transform, opacity", boxShadow: "0 26px 50px -10px rgba(0,0,0,0.28)" }}
        >
          <VisionScreen scale={scale} />
        </div>

        {/* Mission: 2단계 밑→위 슬라이드업으로 덮고, 3단계 다시 위로 걷힘 (고정 헤더 아래) */}
        <div
          ref={missionRef}
          className="absolute inset-0 z-20"
          style={{ transform: "translateY(100%)", willChange: "transform" }}
        >
          <MissionScreen scale={scale} />
        </div>
      </div>
      </div>

      {/* 트랙 종료 후 일반 스크롤로 등장하는 footer */}
      <SiteFooter scale={scale} />
    </>
  );
}

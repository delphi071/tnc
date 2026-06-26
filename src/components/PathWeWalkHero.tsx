"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";
import Header from "./Header";
import SectionNavLabel from "./SectionNavLabel";
import KoriaDulegilSection from "./KoriaDulegilSection";
import RegionalRoadSection from "./RegionalRoadSection";
import CultureProgramSection from "./CultureProgramSection";
import GoodsSection from "./GoodsSection";
import SiteFooter from "./SiteFooter";
import PathWeWalkMobile from "./PathWeWalkMobile";

/** Figma "03. 우리가 걷는 길 main" 좌표계 (1920 기준) */
const STAGE_W = 1920;
const STAGE_H = 1080;

/** 스크롤 길이(핀 고정): 선 그리기 → 흰 패널 4개 차례로 peel (사이사이 hold=탭 조작).
 *  트랙 종료 후 일반 스크롤로 푸터 등장. */
const TRACK_VH = 1400;
const LINE_END = 0.1;
const PANEL1_END = 0.24;
const PANEL2_START = 0.32;
const PANEL2_END = 0.46;
const PANEL3_START = 0.54;
const PANEL3_END = 0.68;
const PANEL4_START = 0.76;
const PANEL4_END = 0.9;

/** 헤드라인 (계단식) */
const HEADLINE = [
  { t: "The Path", left: 653, top: 428 },
  { t: "We Walk", left: 714, top: 528 },
];

/** 헤드라인에서 오른쪽 화면 끝으로 뻗는 두 선 (Figma vector SVG → 스테이지 좌표 변환).
 *  A: "The Path" 옆(715,476)에서 시작하는 상단 가로선 → 왼쪽 화면 끝
 *  B: "We Walk" 옆(1111,565)에서 시작해 내려가 꺾이는 선 → 오른쪽 화면 끝 */
const LINE_A = "M715 476 H0";
const LINE_B = "M1111.4 565 V778 C1111.4 816.66 1142.74 848 1181.4 848 H1920";

/** 테스트용: 선을 처음부터 끝까지 보이게 (튜닝 후 false) */
const SHOW_FULL = false;

/** 푸터 서브메뉴 → 섹션 스크롤 진행도(0~1) */
const SECTION_PROGRESS: Record<string, number> = {
  korea: 0.24,
  regional: 0.46,
  culture: 0.68,
  goods: 0.9,
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export default function PathWeWalkHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const panel4Ref = useRef<HTMLDivElement>(null);
  const lineARef = useRef<SVGPathElement>(null);
  const lineBRef = useRef<SVGPathElement>(null);
  const headerLightRef = useRef(false);
  const hero = useT().thePathWeWalk.hero;
  const [scale, setScale] = useState(1);
  const [headerLight, setHeaderLight] = useState(false);
  const [mobileHeaderLight, setMobileHeaderLight] = useState(false); // 모바일 아코디언(밝은 배경) 여부

  // 진입 시: 해시(#섹션)면 해당 섹션으로, 아니면 맨 위. 같은 페이지 해시 변경도 처리
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const scrollToSection = () => {
      const track = trackRef.current;
      if (!track) return false;
      const p = SECTION_PROGRESS[window.location.hash.slice(1)];
      if (p == null) return false;
      window.scrollTo(0, track.offsetTop + p * (track.offsetHeight - window.innerHeight));
      return true;
    };
    requestAnimationFrame(() => {
      if (!scrollToSection()) window.scrollTo(0, 0);
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

  // 스크롤 진행도(0→1)로 두 선을 글자에서 화면 끝까지 그려나감
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      // 1단계: 두 선을 글자에서 화면 끝까지 그림
      const lineP = clamp01(progress / LINE_END);
      const offset = SHOW_FULL ? "0" : String(1 - lineP);
      if (lineARef.current) lineARef.current.style.strokeDashoffset = offset;
      if (lineBRef.current) lineBRef.current.style.strokeDashoffset = offset;

      // 2단계: 코리아둘레길 흰 패널이 밑에서 올라와 덮음
      const panelP = clamp01((progress - LINE_END) / (PANEL1_END - LINE_END));
      if (panelRef.current) panelRef.current.style.transform = `translateY(${(1 - panelP) * 100}%)`;

      // 3단계: 지역길 조사 흰 패널이 다시 올라와 덮음
      const panel2P = clamp01((progress - PANEL2_START) / (PANEL2_END - PANEL2_START));
      if (panel2Ref.current) panel2Ref.current.style.transform = `translateY(${(1 - panel2P) * 100}%)`;

      // 4단계: 걷기기반 문화 프로그램 흰 패널이 다시 올라와 덮음
      const panel3P = clamp01((progress - PANEL3_START) / (PANEL3_END - PANEL3_START));
      if (panel3Ref.current) panel3Ref.current.style.transform = `translateY(${(1 - panel3P) * 100}%)`;

      // 5단계: 굿즈 기획 및 판매 흰 패널이 다시 올라와 덮음
      const panel4P = clamp01((progress - PANEL4_START) / (PANEL4_END - PANEL4_START));
      if (panel4Ref.current) panel4Ref.current.style.transform = `translateY(${(1 - panel4P) * 100}%)`;

      // 패널이 상단(헤더)까지 덮으면 헤더를 라이트 테마로 전환 (이후 계속 유지)
      const wantLight = panelP >= 0.9;
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

  return (
    <>
      <Header active="thePathWeWalk" fixed theme={headerLight || mobileHeaderLight ? "light" : "dark"} />

      {/* 모바일(lg 미만) 전용 — Hero + 본문 아코디언 */}
      <PathWeWalkMobile onLightChange={setMobileHeaderLight} />

      {/* 데스크톱 스크롤 트랙 (lg+) — 모바일에서는 숨김 */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${TRACK_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* 배경 (풀블리드) */}
          <Image
            src="/intro/pww-hero.jpg"
            alt="우리가 걷는 길"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* 1920 좌표 스테이지 (균일 스케일, 가운데 정렬) */}
          <div
            className="absolute left-1/2 top-1/2 z-10"
            style={{
              width: STAGE_W,
              height: STAGE_H,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            {/* 늘어나는 선 (헤드라인 뒤) */}
            <svg
              viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              fill="none"
            >
              <path
                ref={lineARef}
                d={LINE_A}
                stroke="#0ac200"
                strokeWidth={18.9}
                strokeLinecap="butt"
                strokeLinejoin="round"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: SHOW_FULL ? 0 : 1 }}
              />
              <path
                ref={lineBRef}
                d={LINE_B}
                stroke="#0ac200"
                strokeWidth={18.9}
                strokeLinecap="butt"
                strokeLinejoin="round"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: SHOW_FULL ? 0 : 1 }}
              />
            </svg>

            {/* 헤드라인 — 선 위에 표시 */}
            {HEADLINE.map((w) => (
              <span
                key={w.t}
                className="absolute font-extrabold text-[#0ac200]"
                style={{ left: w.left, top: w.top, fontSize: 100, lineHeight: 1.5, fontFamily: "var(--font-montserrat)" }}
              >
                {w.t}
              </span>
            ))}

            {/* 설명 (헤드라인 아래, 가운데) */}
            <div className="absolute flex flex-col items-center gap-6 whitespace-nowrap text-center text-white" style={{ left: 845, top: 678 }}>
              <p className="font-extrabold" style={{ fontSize: 24, lineHeight: 0.9, letterSpacing: "-1.2px" }}>
                {hero.title}
              </p>
              <div style={{ fontSize: 18, letterSpacing: "-0.72px", lineHeight: 1.45 }}>
                {hero.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

          </div>

          {/* 좌우 섹션 네비 (스테이지 밖, 고정 크기) — 덮는 패널(z≥20) 아래에 깔림 */}
          {/* 좌측 라벨 (이전 섹션: 같은 길, 다른 시선) */}
          <SectionNavLabel side="left" lines={["SAME TRAIL", "NEW VISION"]} href="/same-trail" />
          {/* 우측 라벨 (다음 섹션: 함께 걷는 사람들) */}
          <SectionNavLabel side="right" lines={["WALKING", "TOGETHER"]} href="/walking-together" />

          {/* 코리아둘레길 흰 패널 — 밑에서 올라와 덮음 (탭 클릭형 가로 캐러셀, z-20) */}
          <div
            ref={panelRef}
            className="absolute inset-0 z-20 bg-white"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
            >
              <KoriaDulegilSection />
            </div>
          </div>

          {/* 지역길 조사 및 연구 흰 패널 — 다시 밑에서 올라와 덮음 (탭 캐러셀, z-30) */}
          <div
            ref={panel2Ref}
            className="absolute inset-0 z-30 bg-white"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
            >
              <RegionalRoadSection />
            </div>
          </div>

          {/* 걷기기반 문화 프로그램 흰 패널 — 다시 밑에서 올라와 덮음 (탭 캐러셀, z-40) */}
          <div
            ref={panel3Ref}
            className="absolute inset-0 z-40 bg-white"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
            >
              <CultureProgramSection />
            </div>
          </div>

          {/* 굿즈 기획 및 판매 흰 패널 — 다시 밑에서 올라와 덮음 (탭 캐러셀, z-50) */}
          <div
            ref={panel4Ref}
            className="absolute inset-0 z-50 bg-white"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
            >
              <GoodsSection />
            </div>
          </div>
        </div>
      </div>

      {/* 트랙 종료 후 일반 스크롤로 등장하는 푸터 */}
      <SiteFooter scale={scale} />
    </>
  );
}

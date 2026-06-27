"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";
import Header from "./Header";
import SectionNavLabel from "./SectionNavLabel";
import WalkWithUsContent from "./WalkWithUsContent";
import SiteFooter from "./SiteFooter";
import WalkWithUsMobile from "./WalkWithUsMobile";

/** Figma "06. 마음잇기 main" 좌표계 (1920 기준) */
const STAGE_W = 1920;
const STAGE_H = 1080;

/** 스크롤 길이(핀 고정):
 *  [0~LINE_END]         두 선 그리기
 *  [LINE_END~COVER_END] 후원하기 콘텐츠(밝은 패널+석양)가 밑에서 올라와 히어로를 덮음
 *                       (동시에 히어로 전경은 위로 peel) — "벗겨지는" 전환
 *  [COVER_END~1]        덮은 콘텐츠가 계속 위로 스크롤되어 계좌 카드 노출 */
const TRACK_VH = 420;
const LINE_END = 0.14;
const COVER_END = 0.5;

/** 덮는 단계에서 히어로 전경이 위로 올라가는 거리 */
const PEEL_DIST = 420;

/** 콘텐츠 컬럼 위치(스테이지 px): 화면 아래(덮기 전) → 0(덮음, 첫 화면) → 위로(계좌 노출) */
const C_BELOW = 1080;
const C_END = -320;

/** 헤드라인 — 'l'(Walk)·'i'(with) 글자 위로 두 초록 선이 양쪽 코너로 뻗어나감. */
const HEADLINE = [
  { t: "Walk", left: 561, top: 363 },
  { t: "with Us", left: 879, top: 363 },
];

/** 두 선 (Figma vector → 스테이지 좌표).
 *  A: "with Us" 안에서 위로 올라가 꺾여 오른쪽 화면 끝
 *  B: "Walk"의 'l' 안에서 아래로 내려가 꺾여 왼쪽 화면 끝 */
const LINE_A = "M1066 472 V312 C1066 272 1098 240 1138 240 H1920";
const LINE_B = "M752 440 V602 C752 642 720 662 680 662 H0";

/** 테스트용: 선을 처음부터 끝까지 보이게 (튜닝 후 false) */
const SHOW_FULL = false;

/** 푸터 서브메뉴 → 콘텐츠가 덮인 위치로 스크롤 (탭 선택은 WalkWithUsContent 가 해시로 처리) */
const SECTION_PROGRESS: Record<string, number> = {
  donation: 0.55,
  annual: 0.55,
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export default function WalkWithUsHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const peelRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineARef = useRef<SVGPathElement>(null);
  const lineBRef = useRef<SVGPathElement>(null);
  const headerLightRef = useRef(false);
  const hero = useT().walkWithUs.hero;
  const [scale, setScale] = useState(1);
  const [headerLight, setHeaderLight] = useState(false);
  const [mobileHeaderLight, setMobileHeaderLight] = useState(false); // 모바일 밝은 콘텐츠 여부

  // 진입 시: 해시(#donation/#annual)면 콘텐츠 위치로, 아니면 맨 위. 같은 페이지 해시 변경도 처리
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const scrollToSection = () => {
      const track = trackRef.current;
      if (!track) return false;
      const total = track.offsetHeight - window.innerHeight;
      if (total <= 0) return false; // 트랙이 숨겨짐(모바일 lg 미만) → 모바일 콘텐츠가 처리
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

  // 스크롤 진행도(0→1): 선 → 전경 peel → 밝은 패널 → 콘텐츠 스크롤
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

      // 2단계(덮기): 후원하기 콘텐츠(흰 패널+석양)가 밑에서 올라와 히어로를 덮음.
      //   동시에 히어로 전경은 위로 peel → "벗겨지는" 전환
      const coverP = clamp01((progress - LINE_END) / (COVER_END - LINE_END));
      if (peelRef.current) peelRef.current.style.transform = `translateY(${-PEEL_DIST * coverP}px)`;
      if (panelRef.current) panelRef.current.style.transform = `translateY(${(1 - coverP) * 100}%)`;

      // 3단계(노출): 덮은 콘텐츠가 계속 위로 스크롤 → 계좌 카드 노출
      const revealP = clamp01((progress - COVER_END) / (1 - COVER_END));
      const cY = C_BELOW * (1 - coverP) + C_END * revealP;
      if (contentRef.current) contentRef.current.style.transform = `translateY(${cY}px)`;

      // 콘텐츠가 상단(헤더)까지 덮으면 헤더를 라이트 테마로 전환
      const wantLight = coverP >= 0.8;
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

  const stageStyle = {
    width: STAGE_W,
    height: STAGE_H,
    transform: `translate(-50%, -50%) scale(${scale})`,
  } as const;

  return (
    <>
      <Header active="walkWithUs" fixed theme={headerLight || mobileHeaderLight ? "light" : "dark"} />

      {/* 모바일(lg 미만) 전용 — Hero + 탭(후원하기/연간기금) */}
      <WalkWithUsMobile onLightChange={setMobileHeaderLight} />

      {/* 데스크톱 peel 트랙 (lg+) — 모바일 숨김 */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${TRACK_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* 배경 (풀블리드, 고정) */}
          <Image src="/intro/ww-hero.jpg" alt="마음잇기" fill priority sizes="100vw" className="object-cover" />
          {/* 오버레이: 전체 20% 검정 */}
          <div className="pointer-events-none absolute inset-0 bg-black/20" />

          {/* 1920 좌표 스테이지 (균일 스케일, 가운데 정렬) — 전경 peel */}
          <div className="absolute left-1/2 top-1/2 z-10" style={stageStyle}>
            <div ref={peelRef} className="absolute inset-0" style={{ willChange: "transform" }}>
              {/* 늘어나는 두 선 (헤드라인 뒤) */}
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
                  style={{ left: w.left, top: w.top, fontSize: 100, lineHeight: 1.5, fontFamily: "var(--font-montserrat)", whiteSpace: "pre" }}
                >
                  {w.t}
                </span>
              ))}

              {/* 소제목 + 설명 */}
              <p
                className="absolute -translate-x-1/2 font-extrabold text-white"
                style={{ left: 916, top: 524, fontSize: 24, lineHeight: 0.9, letterSpacing: "-1.2px" }}
              >
                {hero.title}
              </p>
              <p className="absolute text-white" style={{ left: 793, top: 563, fontSize: 18, lineHeight: 1.45, letterSpacing: "-0.72px" }}>
                {hero.desc}
              </p>

            </div>
          </div>

          {/* 좌우 섹션 네비 (스테이지 밖, 고정 크기) — 덮는 패널(z≥20) 아래에 깔림 */}
          {/* 좌측 라벨 (이전 섹션: 알리는 이야기) */}
          <SectionNavLabel side="left" lines={["OUR STORIES"]} href="/our-stories" />
          {/* 우측 라벨 (재단 슬로건 → 우리의 길로 순환) */}
          <SectionNavLabel side="right" lines={["BEYOND", "THE ROUTE"]} href="/our-way" />

          {/* 밝은 패널 — 밑에서 올라와 덮음 (콘텐츠의 고정 배경, z-20) */}
          <div
            ref={panelRef}
            className="absolute inset-0 z-20 bg-[#f0f0f0]"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          />

          {/* 후원하기 콘텐츠 컬럼 — 밝은 패널과 함께 올라와 덮고, 이어서 위로 스크롤 (z-30).
              오버레이는 클릭 통과(pointer-events-none) → 히어로 좌우 라벨 hover/클릭 보존. 콘텐츠만 auto */}
          <div className="pointer-events-none absolute inset-0 z-30">
            <div className="absolute left-1/2 top-1/2" style={stageStyle}>
              <div ref={contentRef} className="pointer-events-auto absolute inset-0" style={{ transform: `translateY(${C_BELOW}px)`, willChange: "transform" }}>
                <WalkWithUsContent />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠(밝은 패널)와 푸터 사이 여백 밴드 — 마지막 프레임 하단(#f0f0f0)을 이어 자연스럽게 넓힘 (PC 전용) */}
      <div className="hidden bg-[#f0f0f0] lg:block" style={{ height: 280 }} />

      {/* 트랙 종료 후 일반 스크롤로 등장하는 푸터 */}
      <SiteFooter scale={scale} />
    </>
  );
}

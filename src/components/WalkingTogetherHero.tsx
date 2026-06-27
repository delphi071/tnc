"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";
import Header from "./Header";
import SectionNavLabel from "./SectionNavLabel";
import OrgCardSection, { type OrgCard } from "./OrgCardSection";
import SiteFooter from "./SiteFooter";
import WalkingTogetherMobile from "./WalkingTogetherMobile";

/** Figma "04. 함께 걷는 사람들 main" 좌표계 (1920 기준) */
const STAGE_W = 1920;
const STAGE_H = 1080;

/** 스크롤 길이(핀 고정): 선 그리기 → 전경 peel → 단체 카드 4개 차례로 peel.
 *  트랙 종료 후 일반 스크롤로 푸터 등장. */
const TRACK_VH = 1000;
const LINE_END = 0.07;
const PEEL_END = 0.17;
const ORG1_START = 0.25;
const ORG1_END = 0.37;
const ORG2_START = 0.45;
const ORG2_END = 0.57;
const ORG3_START = 0.65;
const ORG3_END = 0.77;
const ORG4_START = 0.85;
const ORG4_END = 0.95;

/** 단체 카드 4개 — 로고/링크 메타(웹사이트 순서: KTA·ATN·WTN·GKO). 텍스트는 사전. */
const ORG_META = [
  { logo: "/intro/wt-org-1.png", logoW: 332, href: "https://cafe.daum.net/koreantrails" },
  { logo: "/intro/wt-org-3.png", logoW: 266, href: "https://www.facebook.com/asiatrailsnetwork" },
  { logo: "/intro/wt-org-2.png", logoW: 240, href: "https://worldtrailsnetwork.org" },
  { logo: "/intro/wt-org-4.png", logoW: 242, href: "https://cafe.naver.com/greatkodullers" },
];

/** peel 단계에서 전경이 위로 올라가는 거리 (Figma 측정값) */
const PEEL_DIST = 578;

/** 헤드라인 — "Walking"의 'l'은 초록 선이 대신하므로 "Wa king"(공백)으로 표기 */
const HEADLINE = [
  { t: "Wa king", left: 561, top: 334 },
  { t: "Together", left: 774, top: 432 },
];

/** 헤드라인 'l'(x751)에서 화면 양 끝으로 뻗는 두 선 (Figma vector SVG → 스테이지 좌표).
 *  A: 'l' 위쪽에서 시작해 위로 꺾여 오른쪽 화면 끝
 *  B: 'l' 아래로 내려가 꺾여 왼쪽 화면 끝
 *  STUB: 'l' 자체(항상 표시) */
const LINE_A = "M751 311 V284 C751 245.34 782.34 214 821 214 H1920";
const LINE_B = "M751 307 V780 C751 818.66 719.66 850 681 850 H0";
const STUB = "M751 370 V445";

/** 테스트용: 선을 처음부터 끝까지 보이게 (튜닝 후 false) */
const SHOW_FULL = false;

/** 푸터 서브메뉴 → 섹션 스크롤 진행도(0~1) */
const SECTION_PROGRESS: Record<string, number> = {
  kta: 0.37,
  atn: 0.57,
  wtn: 0.77,
  gko: 0.95,
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export default function WalkingTogetherHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const peelRef = useRef<HTMLDivElement>(null);
  const org1Ref = useRef<HTMLDivElement>(null);
  const org2Ref = useRef<HTMLDivElement>(null);
  const org3Ref = useRef<HTMLDivElement>(null);
  const org4Ref = useRef<HTMLDivElement>(null);
  const lineARef = useRef<SVGPathElement>(null);
  const lineBRef = useRef<SVGPathElement>(null);
  const headerLightRef = useRef(false);
  const wt = useT().walkingTogether;
  const hero = wt.hero;
  const orgCards: OrgCard[] = ORG_META.map((m, i) => ({ ...m, title: wt.orgs[i].title, lines: wt.orgs[i].lines }));
  const [scale, setScale] = useState(1);
  const [headerLight, setHeaderLight] = useState(false);
  const [mobileHeaderLight, setMobileHeaderLight] = useState(false); // 모바일 카드(밝은 배경) 여부

  // 진입 시: 해시(#섹션)면 해당 섹션으로, 아니면 맨 위. 같은 페이지 해시 변경도 처리
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

  // 스크롤 진행도(0→1): 선 그리기 → 전경 peel(위로 스크롤)
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      // 1단계: 두 선을 'l'에서 화면 끝까지 그림
      const lineP = clamp01(progress / LINE_END);
      const offset = SHOW_FULL ? "0" : String(1 - lineP);
      if (lineARef.current) lineARef.current.style.strokeDashoffset = offset;
      if (lineBRef.current) lineBRef.current.style.strokeDashoffset = offset;

      // 2단계: 전경 전체를 위로 PEEL_DIST 만큼 올림 (배경 고정 → 텍스트만 올라옴)
      const peelP = clamp01((progress - LINE_END) / (PEEL_END - LINE_END));
      if (peelRef.current) peelRef.current.style.transform = `translateY(${-PEEL_DIST * peelP}px)`;

      // 3~6단계: 단체 카드 흰 패널 4개가 차례로 밑에서 올라와 덮음
      const org1P = clamp01((progress - ORG1_START) / (ORG1_END - ORG1_START));
      const org2P = clamp01((progress - ORG2_START) / (ORG2_END - ORG2_START));
      const org3P = clamp01((progress - ORG3_START) / (ORG3_END - ORG3_START));
      const org4P = clamp01((progress - ORG4_START) / (ORG4_END - ORG4_START));
      if (org1Ref.current) org1Ref.current.style.transform = `translateY(${(1 - org1P) * 100}%)`;
      if (org2Ref.current) org2Ref.current.style.transform = `translateY(${(1 - org2P) * 100}%)`;
      if (org3Ref.current) org3Ref.current.style.transform = `translateY(${(1 - org3P) * 100}%)`;
      if (org4Ref.current) org4Ref.current.style.transform = `translateY(${(1 - org4P) * 100}%)`;

      // 첫 밝은 패널이 상단(헤더)까지 덮으면 헤더를 라이트 테마로 전환 (이후 계속 유지)
      const wantLight = org1P >= 0.9;
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
      <Header active="walkingTogether" fixed theme={headerLight || mobileHeaderLight ? "light" : "dark"} />

      {/* 모바일(lg 미만) 전용 — Hero + 단체 카드 peel */}
      <WalkingTogetherMobile onLightChange={setMobileHeaderLight} />

      {/* 데스크톱 스크롤 트랙 (lg+) — 모바일에서는 숨김 */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${TRACK_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* 배경 (풀블리드, 고정) */}
          <Image src="/intro/wt-hero.jpg" alt="함께 걷는 사람들" fill priority sizes="100vw" className="object-cover" />
          {/* 오버레이: 전체 10% 검정 + 하단 그라데이션 */}
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-black/60 to-[97%]" />

          {/* 1920 좌표 스테이지 (균일 스케일, 가운데 정렬) */}
          <div
            className="absolute left-1/2 top-1/2 z-10"
            style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
          >
            {/* peel 으로 위로 올라가는 전경 묶음 */}
            <div ref={peelRef} className="absolute inset-0" style={{ willChange: "transform" }}>
              {/* 늘어나는 선 + 'l' 스텁 (헤드라인 뒤) */}
              <svg
                viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                fill="none"
              >
                <path d={STUB} stroke="#0ac200" strokeWidth={18.9} strokeLinecap="butt" />
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

              {/* 설명 */}
              <div className="absolute flex flex-col items-start gap-6 text-white" style={{ left: 795, top: 598 }}>
                <p className="font-extrabold" style={{ fontSize: 24, lineHeight: 0.9, letterSpacing: "-1.2px" }}>
                  {hero.title}
                </p>
                <div style={{ fontSize: 18, letterSpacing: "-0.72px", lineHeight: 1.45 }}>
                  {hero.lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              {/* peel 로 화면 중앙에 올라오는 새 텍스트 (중앙=540 기준 PEEL_DIST 아래에서 시작) */}
              <div
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col text-center font-bold text-white"
                style={{ left: 960, top: 540 + PEEL_DIST, fontSize: 40, lineHeight: 1.2 }}
              >
                {wt.peel.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* 좌우 섹션 네비 (스테이지 밖, 고정 크기) — 덮는 카드 패널(z≥20) 아래에 깔림 */}
          {/* 좌측 라벨 (이전 섹션: 우리가 걷는 길) */}
          <SectionNavLabel side="left" lines={["THE ROUTES", "WE BUILD"]} href="/the-path-we-walk" />
          {/* 우측 라벨 (다음 섹션: 알리는 이야기) */}
          <SectionNavLabel side="right" lines={["OUR STORIES"]} href="/our-stories" />

          {/* 단체 카드 흰 패널 4개 — 차례로 밑에서 올라와 덮음 (z-20~50) */}
          <div ref={org1Ref} className="absolute inset-0 z-20 bg-[#f0f0f0]" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            <div className="absolute left-1/2 top-1/2" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <OrgCardSection {...orgCards[0]} />
            </div>
          </div>
          <div ref={org2Ref} className="absolute inset-0 z-30 bg-[#f0f0f0]" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            <div className="absolute left-1/2 top-1/2" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <OrgCardSection {...orgCards[1]} />
            </div>
          </div>
          <div ref={org3Ref} className="absolute inset-0 z-40 bg-[#f0f0f0]" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            <div className="absolute left-1/2 top-1/2" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <OrgCardSection {...orgCards[2]} />
            </div>
          </div>
          <div ref={org4Ref} className="absolute inset-0 z-50 bg-[#f0f0f0]" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            <div className="absolute left-1/2 top-1/2" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <OrgCardSection {...orgCards[3]} />
            </div>
          </div>
        </div>
      </div>

      {/* 트랙 종료 후 일반 스크롤로 등장하는 푸터 */}
      <SiteFooter scale={scale} />
    </>
  );
}

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

/** 스크롤 길이(핀 고정): 선 그리기 → 전경 peel. 여기까지가 히어로.
 *  단체 카드는 2×2 라 한 화면(1080)을 넘기므로 핀 고정 밖의 일반 스크롤 섹션으로 뺐다.
 *  (예전엔 카드 1개씩 4번 peel 해서 트랙이 1000vh 였다) */
const TRACK_VH = 250;
const LINE_END = 0.35;
const PEEL_END = 0.85;

/** 단체 카드 4개 — 로고/링크 메타(웹사이트 순서: KTA·ATN·WTN·GKO). 텍스트는 사전. */
const ORG_META = [
  { anchor: "kta", logo: "/intro/wt-org-1.png", logoW: 332, href: "https://cafe.daum.net/koreantrails" },
  { anchor: "atn", logo: "/intro/wt-org-3.png", logoW: 266, href: "https://www.facebook.com/asiatrailsnetwork" },
  { anchor: "wtn", logo: "/intro/wt-org-2.png", logoW: 240, href: "https://worldtrailsnetwork.org" },
  { anchor: "gko", logo: "/intro/wt-org-4.png", logoW: 242, href: "https://cafe.naver.com/greatkodullers" },
];

/** peel 단계에서 전경이 위로 올라가는 거리.
 *  peel 텍스트 대기 위치(top: 540 + PEEL_DIST)와 올라오는 거리가 둘 다 이 값에 묶여 있어,
 *  키우면 대기 위치만 스테이지 클립 경계(1080) 아래로 더 내려가고 도착점은 화면 중앙(540)으로 유지된다.
 *  → 풀스크린(작업표시줄 없는 세로 긴 화면)에서도 스크롤 전 텍스트가 보이지 않도록 660 으로 설정. */
const PEEL_DIST = 660;

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

/** 상단 메뉴·푸터 서브메뉴 해시 — 2×2 라 kta·atn 은 첫 줄, wtn·gko 는 둘째 줄에 있다.
 *  각 카드에 붙인 앵커 id(org-kta 등)로 해당 줄까지 스크롤한다. */
const ORG_HASHES = ["kta", "atn", "wtn", "gko"];

/** 고정 헤더 높이(lg 80 / xl 102) — 밝은 섹션 진입 판정, 앵커 스크롤 보정에 함께 쓴다 */
const HEADER_H = 102;
/** 앵커로 이동했을 때 카드가 헤더에 딱 붙지 않도록 두는 여백 */
const CARD_MARGIN = 40;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export default function WalkingTogetherHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const peelRef = useRef<HTMLDivElement>(null);
  const orgSectionRef = useRef<HTMLDivElement>(null);
  const orgInnerRef = useRef<HTMLDivElement>(null);
  const lineARef = useRef<SVGPathElement>(null);
  const lineBRef = useRef<SVGPathElement>(null);
  const headerLightRef = useRef(false);
  const wt = useT().walkingTogether;
  const hero = wt.hero;
  const orgCards: OrgCard[] = ORG_META.map((m, i) => ({ ...m, title: wt.orgs[i].title, lines: wt.orgs[i].lines }));
  const [scale, setScale] = useState(1);
  const [orgH, setOrgH] = useState(0); // 카드 그리드 원본 높이(1920 좌표 기준, 스케일 전)
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
      const hash = window.location.hash.slice(1);
      if (!ORG_HASHES.includes(hash)) return false;
      // 해당 단체 카드가 있는 줄로 이동 (kta·atn = 첫 줄, wtn·gko = 둘째 줄).
      // 카드가 스케일된 래퍼 안에 있어도 getBoundingClientRect 는 변환 후 좌표를 준다.
      const card = document.getElementById(`org-${hash}`);
      const sec = orgSectionRef.current;
      if (!card || !sec) return false;
      const y = window.scrollY + card.getBoundingClientRect().top - HEADER_H - CARD_MARGIN;
      window.scrollTo(0, Math.max(y, sec.offsetTop));
      return true;
    };
    requestAnimationFrame(() => {
      const track = trackRef.current;
      const visible = track ? track.offsetHeight - window.innerHeight > 0 : false;
      if (!scrollToSection() && visible) window.scrollTo(0, 0);
    });
    window.addEventListener("hashchange", scrollToSection);
    return () => window.removeEventListener("hashchange", scrollToSection);
    // orgH 가 정해지기 전(0)에는 섹션 높이가 없어 카드 위치가 틀리므로, 측정 후 한 번 더 실행한다
  }, [orgH]);

  // 화면 폭에 맞춰 스테이지 균일 축소 (1920 초과 시 1.0 유지 → 가운데 정렬)
  useEffect(() => {
    const onResize = () => setScale(Math.min(1, window.innerWidth / STAGE_W));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 카드 그리드는 1920 좌표로 조판한 뒤 scale 로 줄인다. transform 은 레이아웃 높이를 바꾸지
  // 않으므로(=부모가 원본 높이를 그대로 차지) 원본 높이를 재서 래퍼 높이에 scale 을 곱해준다.
  // 텍스트 줄바꿈은 언어/폰트에 따라 달라지니 고정값 대신 ResizeObserver 로 관측.
  useEffect(() => {
    const el = orgInnerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setOrgH(el.offsetHeight));
    ro.observe(el);
    setOrgH(el.offsetHeight);
    return () => ro.disconnect();
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

      // 밝은 카드 섹션이 헤더 높이까지 올라오면 헤더를 라이트 테마로 전환
      const secTop = orgSectionRef.current?.getBoundingClientRect().top ?? Infinity;
      const wantLight = secTop <= HEADER_H;
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

          {/* 1920 좌표 스테이지 (균일 스케일, 가운데 정렬).
              overflow-hidden: peel 텍스트는 1080 아래(top 1118)에 대기시켜 두는데,
              세로로 긴 뷰포트에서 스테이지 하단 여백이 화면에 들어오면 미리 삐져나와 보이므로
              스테이지 프레임 밖(1080 아래/0 위)을 잘라 항상 숨긴다. */}
          <div
            className="absolute left-1/2 top-1/2 z-10 overflow-hidden"
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

          {/* 좌우 섹션 네비 (스테이지 밖, 고정 크기) */}
          {/* 좌측 라벨 (이전 섹션: 우리가 걷는 길) */}
          <SectionNavLabel side="left" lines={["THE ROUTES", "WE BUILD"]} href="/the-path-we-walk" />
          {/* 우측 라벨 (다음 섹션: 알리는 이야기) */}
          <SectionNavLabel side="right" lines={["OUR STORIES"]} href="/our-stories" />
        </div>
      </div>

      {/* 단체 카드 2×2 — 핀 고정 밖의 일반 스크롤 섹션 (한 화면을 넘겨 아래로 스크롤됨).
          scale 은 transform 이라 레이아웃 높이를 바꾸지 않으므로 래퍼에 측정 높이×scale 을 준다. */}
      <div
        ref={orgSectionRef}
        className="relative hidden overflow-hidden bg-[#f0f0f0] lg:block"
        style={{ height: orgH ? orgH * scale : undefined }}
      >
        <div
          ref={orgInnerRef}
          className="absolute left-1/2 top-0"
          style={{ width: STAGE_W, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
        >
          <OrgCardSection cards={orgCards} />
        </div>
      </div>

      {/* 일반 스크롤로 등장하는 푸터 */}
      <SiteFooter scale={scale} />
    </>
  );
}

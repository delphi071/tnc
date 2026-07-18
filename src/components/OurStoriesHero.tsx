"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";
import Header from "./Header";
import SectionNavLabel from "./SectionNavLabel";
import NoticesSection from "./NoticesSection";
import SiteFooter from "./SiteFooter";
import OurStoriesMobile from "./OurStoriesMobile";

/** Figma "05. 알리는 이야기 main" 좌표계 (1920 기준) */
const STAGE_W = 1920;
const STAGE_H = 1080;

/** 선이 그려지는 스크롤 길이(핀 고정). 이후 peel 섹션은 추후 확장 */
const TRACK_VH = 240;

/** 헤드라인 — "Stories"의 'i'는 초록 선(stem)+점(dot)이 대신하므로 "Our Stor es"(공백)으로 표기 */
const HEADLINE = [{ t: "Our Stor es", left: 661, top: 450 }];

/** 헤드라인 'i'(x1122) 주변에서 화면 양 끝으로 뻗는 두 선 (Figma vector SVG → 스테이지 좌표).
 *  A: 'i' stem 아래에서 시작해 내려가 꺾여 오른쪽 화면 끝
 *  B: 헤드라인 옆(799)에서 시작해 올라가 꺾여 왼쪽 화면 끝
 *  STUB: 'i' 세로 획(항상 표시) */
const LINE_A = "M1122 507 V605 C1122 643.66 1153.34 675 1192 675 H1920";
const LINE_B = "M799 513 V284 C799 245.34 767.66 214 729 214 H0";
const STUB = "M1122 507 V561";

/** 테스트용: 선을 처음부터 끝까지 보이게 (튜닝 후 false) */
const SHOW_FULL = false;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export default function OurStoriesHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const noticesRef = useRef<HTMLDivElement>(null);
  const lineARef = useRef<SVGPathElement>(null);
  const lineBRef = useRef<SVGPathElement>(null);
  const headerLightRef = useRef(false);
  const hero = useT().ourStories.hero;
  const [scale, setScale] = useState(1);
  const [headerLight, setHeaderLight] = useState(false);
  const [mobileHeaderLight, setMobileHeaderLight] = useState(false); // 모바일 밝은 콘텐츠 여부

  // 진입 시 스크롤 위치 결정
  //  - 공지/소식받기/문의하기 해시 또는 상세에서 "목록"·뒤로가기(세션 플래그): 공지 섹션으로 스크롤
  //    (탭 선택은 NoticesSection 이 해시로 처리)
  //  - 그 외(새로고침/일반 진입): 브라우저 스크롤 복원을 끄고 항상 맨 위(히어로)에서 시작
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const NOTICE_HASHES = ["#notices", "#subscribe", "#activities", "#archives", "#contact"];
    // 레이아웃(240vh 트랙)이 자리잡은 뒤 공지 섹션으로 이동
    const goNotices = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.getElementById("notices")?.scrollIntoView()),
      );

    const want = NOTICE_HASHES.includes(window.location.hash) || sessionStorage.getItem("os:notices") === "1";
    sessionStorage.removeItem("os:notices");
    if (want) goNotices();
    else window.scrollTo(0, 0);

    const onHash = () => {
      if (NOTICE_HASHES.includes(window.location.hash)) goNotices();
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // 화면 폭에 맞춰 스테이지 균일 축소 (1920 초과 시 1.0 유지 → 가운데 정렬)
  useEffect(() => {
    const onResize = () => setScale(Math.min(1, window.innerWidth / STAGE_W));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 스크롤 진행도(0→1)로 두 선을 화면 끝까지 그려나감
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;
      const offset = SHOW_FULL ? "0" : String(1 - clamp01(progress));
      if (lineARef.current) lineARef.current.style.strokeDashoffset = offset;
      if (lineBRef.current) lineBRef.current.style.strokeDashoffset = offset;

      // 밝은 공지사항 섹션이 헤더 아래로 올라오면 헤더를 라이트 테마로 전환.
      //  단, 데스크톱 트랙이 숨겨진(모바일) 경우엔 건너뜀 — 모바일은 OurStoriesMobile 이 테마 제어.
      //  (숨겨진 noticesRef 의 top=0 이 라이트로 잘못 고정되는 버그 방지)
      const wantLight = el.offsetHeight > 0 && !!noticesRef.current && noticesRef.current.getBoundingClientRect().top <= 102;
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
      <Header active="ourStories" fixed theme={headerLight || mobileHeaderLight ? "light" : "dark"} />

      {/* 모바일(lg 미만) 전용 — Hero + 탭(공지/소식받기/문의) */}
      <OurStoriesMobile onLightChange={setMobileHeaderLight} />

      {/* 데스크톱 히어로 트랙 (lg+) — 모바일 숨김 */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${TRACK_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* 배경 (풀블리드) */}
          <Image src="/intro/os-hero.jpg" alt="알리는 이야기" fill priority sizes="100vw" className="object-cover" />
          {/* 오버레이: 전체 10% 검정 + 하단 그라데이션 */}
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-black/60 to-[97%]" />

          {/* 1920 좌표 스테이지 (균일 스케일, 가운데 정렬) */}
          <div
            className="absolute left-1/2 top-1/2 z-10"
            style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
          >
            {/* 늘어나는 선 + 'i' 세로획 스텁 (헤드라인 뒤) */}
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

            {/* 'i' 점(dot) — 항상 표시 */}
            <div className="absolute rounded-full bg-[#0ac200]" style={{ left: 1110, top: 477, width: 23, height: 23 }} />

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

            {/* 설명 (헤드라인 아래, 가운데) */}
            <div className="absolute flex -translate-x-1/2 flex-col items-center gap-6 text-center text-white" style={{ left: 960, top: 611 }}>
              <p className="font-extrabold" style={{ fontSize: 24, lineHeight: 0.9, letterSpacing: "-1.2px" }}>
                {hero.title}
              </p>
              <div style={{ fontSize: 18, lineHeight: 1.45, letterSpacing: "-0.72px" }}>
                {hero.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

          </div>

          {/* 좌우 섹션 네비 (스테이지 밖, 고정 크기) — 히어로 위에 표시, 이후 공지 섹션이 스크롤로 덮음 */}
          {/* 좌측 라벨 (이전 섹션: 함께 걷는 사람들) */}
          <SectionNavLabel side="left" lines={["WALKING", "TOGETHER"]} href="/walking-together" />
          {/* 우측 라벨 (다음 섹션: 마음잇기) */}
          <SectionNavLabel side="right" lines={["WALK", "WITH US"]} href="/walk-with-us" />
        </div>
      </div>

      {/* 히어로 다음, 일반 스크롤로 바로 등장하는 밝은 공지사항 콘텐츠 + 푸터 */}
      {/* scrollMarginTop=0: 목록 복귀 시 공지 섹션 top을 0에 맞춰, 헤더(높이 102) 전체가
          밝은 #f0f0f0 섹션 위에 오도록 한다. (그래야 헤더가 라이트로 전환돼 메뉴가 잘 보임) */}
      <div id="notices" ref={noticesRef} className="hidden lg:block" style={{ scrollMarginTop: 0 }}>
        <NoticesSection />
      </div>
      <SiteFooter scale={scale} />
    </>
  );
}

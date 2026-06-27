"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";
import Header from "./Header";
import SectionNavLabel from "./SectionNavLabel";
import SiteFooter from "./SiteFooter";
import SameTrailMobile from "./SameTrailMobile";

/** Figma "02. 같은길 다른시선" 좌표계 (1920 기준) */
const STAGE_W = 1920;
const STAGE_H = 1080;

/** 스크롤 길이(핀 고정):
 *  [0~LINE_END]              선 그리기
 *  [LINE_END~PEEL1_END]      전경 peel(헤드라인·텍스트 위로 스크롤)
 *  [PEEL1_END~PANEL2_END]    밝은 패널(기획에서 체험까지)이 올라와 덮음
 *  [PANEL2_END~PANEL3_END]   밝은 패널(Plan 워터마크)이 올라와 덮음
 *  [PANEL3_END~CONTENT4_END] Plan 섹션 콘텐츠가 워터마크 위로 세로 스크롤 (배경 고정)
 *  [CONTENT4_END~ANALYSIS_END] 밝은 패널(Analysis 워터마크)이 배경째 올라와 덮음 */
const TRACK_VH = 1550;
const LINE_END = 0.06;
const PEEL1_END = 0.12;
const PANEL2_END = 0.18;
const PANEL3_END = 0.24;
const CONTENT4_END = 0.45;
const ANALYSIS_END = 0.52;
const CONTENT7_END = 0.72;
const EXPERIENCE_END = 0.79;
const CONTENT10_END = 0.98;

/** peel 단계에서 전경이 위로 올라가는 거리 (Figma 측정값) */
const PEEL_DIST = 612;

/** contents 콘텐츠 컬럼의 세로 스크롤 범위(스테이지 px): 아래에서 진입 → 위로 통과 */
const C4_START = 880;
const C4_END = -720;
const C7_START = 880;
const C7_END = -720;
const C10_START = 880;
const C10_END = -720;

/** 계단식 헤드라인 (Same / Trail / New / Vision) */
const HEADLINE = [
  { t: "Same", left: 672, top: 332 },
  { t: "Trail", left: 672, top: 433 },
  { t: "New", left: 969, top: 433 },
  { t: "Vision", left: 969, top: 534 },
];

/** 헤드라인에서 화면 양 끝으로 뻗는 두 선 (Figma vector SVG → 스테이지 좌표 변환). */
const LINE_A = "M1245 600 V546 C1245 507.34 1276.34 476 1315 476 H1920";
const LINE_B = "M885 535 V682 C885 720.66 853.66 752 815 752 H0";

/** 테스트용: 선을 처음부터 끝까지 보이게 (튜닝 후 false) */
const SHOW_FULL = false;

/** 푸터·메뉴 서브메뉴 → 섹션 스크롤 진행도(0~1)
 *  expertise = "기획에서 체험까지 …전문 법인" 인트로 패널이 완전히 올라온 지점(PANEL2_END). */
const SECTION_PROGRESS: Record<string, number> = {
  expertise: 0.18,
  plan: 0.34,
  analysis: 0.62,
  experience: 0.88,
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export default function SameTrailHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const peelRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const panel4Ref = useRef<HTMLDivElement>(null);
  const content4Ref = useRef<HTMLDivElement>(null);
  const content7Ref = useRef<HTMLDivElement>(null);
  const content10Ref = useRef<HTMLDivElement>(null);
  const lineARef = useRef<SVGPathElement>(null);
  const lineBRef = useRef<SVGPathElement>(null);
  const headerLightRef = useRef(false);

  const st = useT().sameTrail;
  const [scale, setScale] = useState(1);
  const [headerLight, setHeaderLight] = useState(false);
  const [mobileHeaderLight, setMobileHeaderLight] = useState(false); // 모바일 카드 스택의 밝은 섹션 여부

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
      // 데스크톱 트랙이 실제로 보일 때만 top 리셋 (모바일에선 카드스택 효과를 건드리지 않음)
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

  // 스크롤 진행도(0→1): 선 → 전경 peel → 밝은 패널 ×2 → Plan 콘텐츠 스크롤
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

      // 2단계: 전경 전체를 위로 PEEL_DIST 만큼 올림 (배경 고정)
      const peelP = clamp01((progress - LINE_END) / (PEEL1_END - LINE_END));
      if (peelRef.current) peelRef.current.style.transform = `translateY(${-PEEL_DIST * peelP}px)`;

      // 3단계: 밝은 패널(기획에서 체험까지)이 밑에서 올라와 덮음
      const panelP = clamp01((progress - PEEL1_END) / (PANEL2_END - PEEL1_END));
      if (panelRef.current) panelRef.current.style.transform = `translateY(${(1 - panelP) * 100}%)`;

      // 4단계: 밝은 패널(Plan)이 다시 올라와 덮음
      const panel2P = clamp01((progress - PANEL2_END) / (PANEL3_END - PANEL2_END));
      if (panel2Ref.current) panel2Ref.current.style.transform = `translateY(${(1 - panel2P) * 100}%)`;

      // 5단계: Plan 섹션 콘텐츠 컬럼이 워터마크 위로 세로 스크롤 (배경·워터마크 고정)
      const content4P = clamp01((progress - PANEL3_END) / (CONTENT4_END - PANEL3_END));
      const c4Y = C4_START + (C4_END - C4_START) * content4P;
      if (content4Ref.current) content4Ref.current.style.transform = `translateY(${c4Y}px)`;

      // 6단계: 밝은 패널(Analysis)이 배경째 밑에서 올라와 덮음
      const analysisP = clamp01((progress - CONTENT4_END) / (ANALYSIS_END - CONTENT4_END));
      if (panel3Ref.current) panel3Ref.current.style.transform = `translateY(${(1 - analysisP) * 100}%)`;

      // 7단계: Analysis 섹션 콘텐츠 컬럼이 워터마크 위로 세로 스크롤 (배경·워터마크 고정)
      const content7P = clamp01((progress - ANALYSIS_END) / (CONTENT7_END - ANALYSIS_END));
      const c7Y = C7_START + (C7_END - C7_START) * content7P;
      if (content7Ref.current) content7Ref.current.style.transform = `translateY(${c7Y}px)`;

      // 8단계: 밝은 패널(experience)이 배경째 밑에서 올라와 덮음
      const experienceP = clamp01((progress - CONTENT7_END) / (EXPERIENCE_END - CONTENT7_END));
      if (panel4Ref.current) panel4Ref.current.style.transform = `translateY(${(1 - experienceP) * 100}%)`;

      // 9단계: experience 섹션 콘텐츠 컬럼이 워터마크 위로 세로 스크롤
      const content10P = clamp01((progress - EXPERIENCE_END) / (CONTENT10_END - EXPERIENCE_END));
      const c10Y = C10_START + (C10_END - C10_START) * content10P;
      if (content10Ref.current) content10Ref.current.style.transform = `translateY(${c10Y}px)`;

      // 밝은 패널이 상단(헤더)까지 덮으면 헤더를 라이트 테마로 전환 (이후 계속 유지)
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

  const stageStyle = {
    width: STAGE_W,
    height: STAGE_H,
    transform: `translate(-50%, -50%) scale(${scale})`,
  } as const;

  return (
    <>
      <Header active="sameTrail" fixed theme={headerLight || mobileHeaderLight ? "light" : "dark"} />

      {/* 모바일(lg 미만) 전용 — 카드 스택 peel (Hero → 인트로 → Plan/Analysis/Experience) */}
      <SameTrailMobile onLightChange={setMobileHeaderLight} />

      {/* 데스크톱 스크롤 트랙 (lg+) — 모바일에서는 숨김 */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${TRACK_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* 배경 (풀블리드, 고정) */}
          <Image
            src="/intro/bg-2.jpg"
            alt="같은 길, 다른 시선"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* 하단 그라데이션 (Figma: 38% 투명 → 97% 검정 60%) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-black/60 to-[97%]" />

          {/* 1920 좌표 스테이지 (균일 스케일, 가운데 정렬) */}
          <div className="absolute left-1/2 top-1/2 z-10" style={stageStyle}>
            {/* peel 으로 위로 올라가는 전경 묶음 */}
            <div ref={peelRef} className="absolute inset-0" style={{ willChange: "transform" }}>
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  style={{ strokeDasharray: 1, strokeDashoffset: SHOW_FULL ? 0 : 1 }}
                />
                <path
                  ref={lineBRef}
                  d={LINE_B}
                  stroke="#0ac200"
                  strokeWidth={18.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  style={{ strokeDasharray: 1, strokeDashoffset: SHOW_FULL ? 0 : 1 }}
                />
              </svg>

              {/* 헤드라인 (계단식) — 선 위에 표시 */}
              {HEADLINE.map((w) => (
                <span
                  key={w.t}
                  className="absolute font-extrabold text-[#0ac200]"
                  style={{ left: w.left, top: w.top, fontSize: 100, lineHeight: 1.5, fontFamily: "var(--font-montserrat)" }}
                >
                  {w.t}
                </span>
              ))}

              {/* 설명 (헤드라인 우측) */}
              <div className="absolute flex flex-col gap-6 text-white" style={{ left: 1321, top: 554 }}>
                <p className="font-extrabold" style={{ fontSize: 24, lineHeight: 0.9, letterSpacing: "-1.2px" }}>
                  {st.hero.title}
                </p>
                <div style={{ fontSize: 18, letterSpacing: "-0.72px", lineHeight: 1.45 }}>
                  {st.hero.lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              {/* peel 로 화면 중앙에 올라오는 새 텍스트 */}
              <div
                className="absolute flex -translate-y-1/2 flex-col items-center gap-8 text-center text-white"
                style={{ left: 360, top: 540 + PEEL_DIST, width: 1200 }}
              >
                <div className="font-bold" style={{ fontSize: 40, lineHeight: 1.2, letterSpacing: "-0.4px" }}>
                  {st.peel.headline.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="whitespace-nowrap" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.36px" }}>
                  {st.peel.desc.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 좌우 섹션 네비 (스테이지 밖, 고정 크기) — 덮는 패널(z≥20) 아래에 깔림 */}
          {/* 좌측 라벨 (이전 섹션: 우리의 길) */}
          <SectionNavLabel side="left" lines={["BEYOND", "THE ROUTE"]} href="/our-way" />
          {/* 우측 라벨 (다음 섹션: 우리가 걷는 길) */}
          <SectionNavLabel side="right" lines={["THE PATH", "WE WALK"]} href="/the-path-we-walk" />

          {/* 밝은 패널 (기획에서 체험까지) — 밑에서 올라와 덮음 (z-20) */}
          <div
            ref={panelRef}
            className="absolute inset-0 z-20 flex items-center justify-center bg-[#f0f0f0]"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            <div
              className="text-center font-bold text-black"
              style={{ transform: `scale(${scale})`, fontSize: 40, lineHeight: 1.5, letterSpacing: "-2.4px" }}
            >
              {st.panel.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {/* 밝은 패널 (Plan 워터마크) — 다시 밑에서 올라와 덮음. 이후 콘텐츠의 고정 배경 (z-30) */}
          <div
            ref={panel2Ref}
            className="absolute inset-0 z-30 flex items-center justify-center bg-[#f0f0f0]"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            <p
              className="font-semibold leading-none text-[#d9d9d9] opacity-50"
              style={{ transform: `scale(${scale})`, fontSize: 200, fontFamily: "var(--font-montserrat)" }}
            >
              Plan
            </p>
          </div>

          {/* Plan 섹션 콘텐츠 컬럼 — Plan 워터마크 위로 세로 스크롤 (z-40, 투명 배경) */}
          <div className="pointer-events-none absolute inset-0 z-40">
            <div className="absolute left-1/2 top-1/2" style={stageStyle}>
              <div ref={content4Ref} className="absolute inset-0" style={{ transform: `translateY(${C4_START}px)`, willChange: "transform" }}>
                {/* 타이틀 */}
                <div className="absolute flex flex-col items-center gap-5 text-center" style={{ left: 360, top: 200, width: 1200 }}>
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-bold text-[#0ac200]" style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.624px" }}>
                      {st.plan.eyebrow}
                    </p>
                    <p className="font-bold text-black" style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.36px" }}>
                      {st.plan.title}
                    </p>
                  </div>
                  <p className="text-[#5a5b5d]" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.18px" }}>
                    {st.plan.subtitle}
                  </p>
                </div>

                {/* 이미지 1 (경기둘레길 해안) */}
                <div
                  className="absolute overflow-hidden rounded-br-[60px] rounded-tl-[60px]"
                  style={{ left: 284, top: 398, width: 620, height: 382 }}
                >
                  <Image src="/intro/st-plan-1.png" alt="경기둘레길" fill sizes="620px" className="object-cover" />
                </div>

                {/* 우측 본문 (이미지1 아래, 우측 정렬) */}
                <div
                  className="absolute whitespace-nowrap text-right text-[#5a5b5d]"
                  style={{ right: 1016, top: 807, fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.18px" }}
                >
                  {st.plan.body1.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                {/* 이미지 2 (숲길) */}
                <div
                  className="absolute overflow-hidden rounded-br-[60px] rounded-tl-[60px]"
                  style={{ left: 1005, top: 964, width: 524, height: 544 }}
                >
                  <Image src="/intro/st-plan-2.jpg" alt="" fill sizes="524px" className="object-cover object-center" />
                </div>

                {/* 하단 본문 (이미지2 아래) */}
                <div
                  className="absolute whitespace-nowrap text-[#5a5b5d]"
                  style={{ left: 1005, top: 1550, fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.18px" }}
                >
                  {st.plan.body2.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 밝은 패널 (Analysis 워터마크) — 배경째 밑에서 올라와 덮음. 이후 콘텐츠의 고정 배경 (z-50) */}
          <div
            ref={panel3Ref}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#f0f0f0]"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            <p
              className="font-semibold leading-none text-[#d9d9d9] opacity-50"
              style={{ transform: `scale(${scale})`, fontSize: 200, fontFamily: "var(--font-montserrat)" }}
            >
              Analysis
            </p>
          </div>

          {/* Analysis 섹션 콘텐츠 컬럼 — Analysis 워터마크 위로 세로 스크롤 (z-60, 투명 배경) */}
          <div className="pointer-events-none absolute inset-0 z-[60]">
            <div className="absolute left-1/2 top-1/2" style={stageStyle}>
              <div ref={content7Ref} className="absolute inset-0" style={{ transform: `translateY(${C7_START}px)`, willChange: "transform" }}>
                {/* 타이틀 */}
                <div className="absolute flex -translate-x-1/2 flex-col items-center gap-5 text-center" style={{ left: 970, top: 200 }}>
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-bold text-[#0ac200]" style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.624px" }}>
                      {st.analysis.eyebrow}
                    </p>
                    <p className="font-bold text-black" style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.36px" }}>
                      {st.analysis.title}
                    </p>
                  </div>
                  <p className="text-[#5a5b5d]" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.18px" }}>
                    {st.analysis.subtitle}
                  </p>
                </div>

                {/* 이미지 2 (액자 프레임) — 우측 상단 */}
                <div
                  className="absolute overflow-hidden rounded-br-[60px] rounded-tl-[60px]"
                  style={{ left: 1015, top: 424, width: 755, height: 426 }}
                >
                  <Image src="/intro/st-analysis-2.jpg" alt="" fill sizes="755px" className="object-cover" />
                </div>

                {/* 중간 본문 (이미지2 아래) */}
                <div
                  className="absolute whitespace-nowrap text-[#5a5b5d]"
                  style={{ left: 1015, top: 881, fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.18px" }}
                >
                  {st.analysis.body1.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                {/* 이미지 1 (남해대교와 노량) — 좌측 하단 */}
                <div
                  className="absolute overflow-hidden rounded-br-[60px] rounded-tl-[60px]"
                  style={{ left: 443, top: 942, width: 474, height: 551 }}
                >
                  <Image src="/intro/st-analysis-1-cliff.jpg" alt="" fill sizes="474px" className="object-cover object-[30%_center]" />
                </div>

                {/* 우측 하단 본문 (이미지1 아래, 우측 정렬) */}
                <div
                  className="absolute flex flex-col items-end gap-[19px] whitespace-nowrap text-[#5a5b5d]"
                  style={{ right: 1003, top: 1540, fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.18px" }}
                >
                  <div className="text-right">
                    {st.analysis.body2.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <div className="text-right">
                    {st.analysis.body3.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 밝은 패널 (experience 워터마크) — 배경째 밑에서 올라와 덮음. 이후 콘텐츠의 고정 배경 (z-70) */}
          <div
            ref={panel4Ref}
            className="absolute inset-0 z-[70] flex items-center justify-center bg-[#f0f0f0]"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            <p
              className="font-semibold leading-none text-[#d9d9d9] opacity-50"
              style={{ transform: `scale(${scale})`, fontSize: 200, fontFamily: "var(--font-montserrat)" }}
            >
              experience
            </p>
          </div>

          {/* experience 섹션 콘텐츠 컬럼 — 워터마크 위로 세로 스크롤 (z-80, 투명 배경) */}
          <div className="pointer-events-none absolute inset-0 z-[80]">
            <div className="absolute left-1/2 top-1/2" style={stageStyle}>
              <div ref={content10Ref} className="absolute inset-0" style={{ transform: `translateY(${C10_START}px)`, willChange: "transform" }}>
                {/* 타이틀 */}
                <div className="absolute flex -translate-x-1/2 flex-col items-center gap-5 text-center" style={{ left: 970, top: 200, width: 1000 }}>
                  <div className="flex w-full flex-col items-center gap-2">
                    <p className="font-bold text-[#0ac200]" style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.624px" }}>
                      {st.experience.eyebrow}
                    </p>
                    <p className="font-bold text-black" style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.36px" }}>
                      {st.experience.title}
                    </p>
                  </div>
                  <p className="text-[#5a5b5d]" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.18px" }}>
                    {st.experience.subtitle}
                  </p>
                </div>

                {/* 이미지 1 (남파랑길44코스 남해) — 좌측 상단 */}
                <div
                  className="absolute overflow-hidden rounded-br-[60px] rounded-tl-[60px]"
                  style={{ left: 240, top: 427.5, width: 677, height: 405 }}
                >
                  <Image src="/intro/st-exp-1.jpg" alt="" fill sizes="677px" className="object-cover" />
                </div>

                {/* 중간 본문 (이미지1 아래, 우측 정렬) */}
                <div
                  className="absolute whitespace-nowrap text-right text-[#5a5b5d]"
                  style={{ right: 1002, top: 867.5, fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.18px" }}
                >
                  {st.experience.body1.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                {/* 이미지 2 (남파랑길22코스 구조라성 솔숲) — 우측 하단 */}
                <div
                  className="absolute overflow-hidden rounded-br-[60px] rounded-tl-[60px]"
                  style={{ left: 1094, top: 966, width: 721, height: 447 }}
                >
                  <Image src="/intro/st-exp-2.jpg" alt="" fill sizes="721px" className="object-cover object-center" />
                </div>

                {/* 우측 하단 본문 (이미지2 아래) */}
                <div
                  className="absolute flex flex-col gap-[19px] whitespace-nowrap text-[#5a5b5d]"
                  style={{ left: 1094, top: 1444, fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.18px" }}
                >
                  <div>
                    {st.experience.body2.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <div>
                    {st.experience.body3.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 트랙 종료 후 일반 스크롤로 등장하는 푸터 */}
      <SiteFooter scale={scale} />
    </>
  );
}

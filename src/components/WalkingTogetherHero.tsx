"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import SectionNavLabel from "./SectionNavLabel";
import OrgCardSection, { type OrgCard } from "./OrgCardSection";
import SiteFooter from "./SiteFooter";

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

/** 단체 카드 4개 (피그마 순서). 버튼은 새 창 외부 링크 */
const ORG_CARDS: OrgCard[] = [
  {
    logo: "/intro/wt-org-1.png",
    logoW: 332,
    title: "한국걷는길연합",
    lines: [
      "한국걷는길연합(KTA)은 한국의 도보 여행길을 운영하고 관리하는 단체들의 모임으로,",
      "도보여행을 통해 자연의 소중함을 알리고, 지역문화를 재발견하여 지속 가능한 지역관광 활성화와",
      "공동체 발전을 목표로 활동하는 단체입니다.",
      "사단법인 한국의문화를 포함한 20개에 이르는 걷기 길 단체가 모여",
      "지속가능한 걷기 문화를 만들어 나가고 있습니다.",
    ],
    href: "https://cafe.daum.net/koreantrails",
  },
  {
    logo: "/intro/wt-org-3.png",
    logoW: 266,
    title: "아시아 트레일즈 네트워크(ATN)",
    lines: [
      "아시아 각국의 트레일을 연결하는 지역 기반 국제 네트워크로, 국가 간 교류와 공동 프로그램을 통해",
      "아시아 트레일의 다양성과 연결성을 강화하는 다양한 사업을 진행하고 있습니다.",
      "사단법인 한국의길과문화는 ATN과 함께 한국의 길을 아시아 맥락 속에서 해석하고,",
      "한국의 길을 아시아와 잇는 역할을 수행하고 있습니다.",
    ],
    href: "https://www.facebook.com/asiatrailsnetwork",
  },
  {
    logo: "/intro/wt-org-2.png",
    logoW: 240,
    title: "월드 트레일즈 네트워크(WTN)",
    lines: [
      "전 세계의 트레일과 걷기길을 연결하는 글로벌 협력 네트워크입니다.",
      "각국의 운영 주체들이 교류하며 트레일 보전과 지속가능한 이용, 걷기 관광의 가치를 함께 만들어가고 있습니다.",
      "한국의길과문화는 WTN과의 협력을 통해 한국의 길을 세계와 연결하고, 그 경험과 콘텐츠를 확장하고 있습니다.",
      "길을 매개로 사람과 자연, 지역을 잇는 글로벌 흐름을 함께 만들어가고 있습니다.",
    ],
    href: "https://worldtrailsnetwork.org",
  },
  {
    logo: "/intro/wt-org-4.png",
    logoW: 242,
    title: "GKO(코리아둘레길 완보자클럽)",
    lines: [
      "코리아둘레길(해파랑길, 남파랑길, 서해랑길, DMZ평화의길) 중 1개 이상을 완주한 사람들이 모인 코리아둘레길 완보자 클럽은",
      "지속 가능한 걷기 여행 문화 확산을 목적으로 2024년 5월 발족한 모임입니다.",
      "4500km 전 구간 완주자(그랜드슬램)를 포함한 회원들이 정보를 교류하며, 단순한 걷기 모임을 넘어",
      "코리아둘레길 관련 행사 및 홍보 활동을 주도하고 있습니다.",
    ],
    href: "https://cafe.naver.com/greatkodullers",
  },
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
  const [scale, setScale] = useState(1);
  const [headerLight, setHeaderLight] = useState(false);

  // 새로고침 시 브라우저 스크롤 복원을 끄고 항상 맨 위에서 시작
  useEffect(() => {
    if ("scrollRestoration" in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      return () => {
        history.scrollRestoration = prev;
      };
    }
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
      <Header active="함께 걷는 사람들" fixed theme={headerLight ? "light" : "dark"} />

      <div ref={trackRef} className="relative" style={{ height: `${TRACK_VH}vh` }}>
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
                  함께 걷는 사람들
                </p>
                <div style={{ fontSize: 18, letterSpacing: "-0.72px", lineHeight: 1.45 }}>
                  <p>함께 걸어서 아름다운 길,</p>
                  <p>같이 해서 힘이 되는 길을 걷습니다</p>
                </div>
              </div>

              {/* 좌측 라벨 (이전 섹션: 우리가 걷는 길) */}
              <SectionNavLabel side="left" lines={["THE ROUTES", "WE BUILD"]} href="/the-path-we-walk" />

              {/* 우측 라벨 (다음 섹션: 알리는 이야기) */}
              <SectionNavLabel side="right" lines={["OUR STORIES"]} href="/our-stories" />

              {/* peel 로 화면 중앙에 올라오는 새 텍스트 (중앙=540 기준 PEEL_DIST 아래에서 시작) */}
              <div
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col text-center font-bold text-white"
                style={{ left: 960, top: 540 + PEEL_DIST, fontSize: 40, lineHeight: 1.2 }}
              >
                <p>함께 걸어서 아름다운 길,</p>
                <p>같이 해서 힘이 되는 길을 걷습니다.</p>
              </div>
            </div>
          </div>

          {/* 단체 카드 흰 패널 4개 — 차례로 밑에서 올라와 덮음 (z-20~50) */}
          <div ref={org1Ref} className="absolute inset-0 z-20 bg-[#f0f0f0]" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            <div className="absolute left-1/2 top-1/2" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <OrgCardSection {...ORG_CARDS[0]} />
            </div>
          </div>
          <div ref={org2Ref} className="absolute inset-0 z-30 bg-[#f0f0f0]" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            <div className="absolute left-1/2 top-1/2" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <OrgCardSection {...ORG_CARDS[1]} />
            </div>
          </div>
          <div ref={org3Ref} className="absolute inset-0 z-40 bg-[#f0f0f0]" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            <div className="absolute left-1/2 top-1/2" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <OrgCardSection {...ORG_CARDS[2]} />
            </div>
          </div>
          <div ref={org4Ref} className="absolute inset-0 z-50 bg-[#f0f0f0]" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            <div className="absolute left-1/2 top-1/2" style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <OrgCardSection {...ORG_CARDS[3]} />
            </div>
          </div>
        </div>
      </div>

      {/* 트랙 종료 후 일반 스크롤로 등장하는 푸터 */}
      <SiteFooter scale={scale} />
    </>
  );
}

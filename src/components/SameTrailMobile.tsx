"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { type ReactNode, type RefObject, useEffect, useRef } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** 모바일 "기획에서 체험까지" 패널 — 디자인상 3줄로 끊어 표시(ko). en 은 사전 그대로. */
const PANEL_LINES_KO = ["기획에서 체험까지,", "길에 이야기를 입히는", "걷기길 전문 법인"];

/** 같은 길, 다른 시선 — 모바일(lg 미만) 전용. 카드 스택 peel.
 *  Hero 텍스트 → (같은 고정 배경 위에서) 인트로 peel 텍스트로 전환 →
 *  "기획에서 체험까지" 패널 → Plan → Analysis → Experience (밝은 카드들이 덮음).
 *  Plan/Analysis/Experience 는 흐린 워터마크(고정) 위로 콘텐츠가 내부 세로 스크롤.
 *  문구는 PC 사전(sameTrail.*) 그대로 사용. */

const TRACK_VH = 1080;
/** 진행도 분기: [0~A_END] hero→인트로 peel 텍스트 / [A_END~COVER_END] 밝은 스택이 덮음 / 이후 카드 peel */
const A_END = 0.1;
const COVER_END = 0.16;
const CARD_HOLD = 0.45;

/** 푸터·햄버거 메뉴 서브링크(#해시) → 카드스택 스크롤 진행도(0~1).
 *  expertise = "기획에서 체험까지" 패널이 완전히 덮은 직후(peel 전) 지점. */
const SECTION_PROGRESS: Record<string, number> = {
  expertise: 0.17,
  plan: 0.3,
  analysis: 0.55,
  experience: 0.8,
};
/** 섹션(Plan/Analysis/Experience) 내부 스크롤 가중치 */
const SEC_W = 5;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smoothstep = (x: number) => x * x * (3 - 2 * x);

const MONT = { fontFamily: "var(--font-montserrat)" } as const;

/** 섹션 카드(흐린 워터마크 + 내부 스크롤 콘텐츠) */
function Section({
  kind,
  z,
  mark,
  contentRef,
  children,
}: {
  kind: string;
  z: number;
  mark: string;
  contentRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  return (
    <div data-card={kind} className="absolute inset-0 overflow-hidden bg-[#f0f0f0]" style={{ zIndex: z, willChange: "transform" }}>
      <p
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-[60px] font-semibold leading-none text-[#d9d9d9]"
        style={MONT}
      >
        {mark}
      </p>
      <div ref={contentRef} className="absolute left-0 top-0 w-full px-[18px]" style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}

/** 섹션 header (eyebrow + title + subtitle) */
function SecHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-5 pt-[100px] text-center">
      <div className="flex flex-col items-center gap-2">
        <p className="text-[24px] font-bold leading-[1.3] tracking-[-0.624px] text-[#0ac200]">{eyebrow}</p>
        <p className="text-[36px] font-bold leading-[1.1] tracking-[-0.36px] text-black">{title}</p>
      </div>
      <p className="whitespace-pre-line text-[18px] leading-[1.3] tracking-[-0.18px] text-[#5a5b5d]">{subtitle}</p>
    </div>
  );
}

function Body({
  lines,
  align = "center",
  className = "",
}: {
  lines: string[];
  align?: "left" | "center" | "right";
  className?: string;
}) {
  const a = align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center";
  return (
    <div className={`${a} text-[18px] leading-[1.4] tracking-[-0.18px] text-[#5a5b5d] ${className}`}>
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
}

function Pic({ src, h, className = "" }: { src: string; h: number; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-tl-[40px] rounded-br-[40px] ${className}`}>
      <img src={src} alt="" className="w-full object-cover" style={{ height: h }} />
    </div>
  );
}

export default function SameTrailMobile({ onLightChange }: { onLightChange?: (light: boolean) => void }) {
  const st = useT().sameTrail;
  const { locale } = useLocale();
  const panelLines = locale === "ko" ? PANEL_LINES_KO : st.panel;
  const trackRef = useRef<HTMLDivElement>(null);
  const heroFgRef = useRef<HTMLDivElement>(null);
  const introPeelRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      // phase A: hero 텍스트는 위로 걷히고, 인트로 peel 텍스트가 아래에서 올라옴 (배경은 고정 — 중복 없음)
      const aP = clamp01(progress / A_END);
      if (heroFgRef.current) heroFgRef.current.style.transform = `translateY(${-aP * 130}%)`;
      if (introPeelRef.current) introPeelRef.current.style.transform = `translateY(${(1 - aP) * 100}%)`;

      // 밝은 스택(패널+섹션)이 밑에서 올라와 덮음
      const coverP = clamp01((progress - A_END) / (COVER_END - A_END));
      const stack = stackRef.current;
      if (!stack) return;
      stack.style.transform = `translateY(${(1 - coverP) * 100}%)`;

      // 덮은 뒤 카드 peel + 섹션 내부 스크롤
      const peelP = clamp01((progress - COVER_END) / (1 - COVER_END));
      const cards = stack.querySelectorAll<HTMLElement>("[data-card]");
      const last = cards.length - 1;
      let acc = 0;
      const peelStart: number[] = [];
      const secStart: Record<string, number> = {};
      cards.forEach((card, k) => {
        const kind = card.dataset.card || "";
        if (kind === "plan" || kind === "analysis" || kind === "experience") {
          secStart[kind] = acc;
          acc += SEC_W;
        }
        peelStart[k] = k < last ? acc : -1;
        if (k < last) acc += 1;
      });
      const g = peelP * acc;

      cards.forEach((card, k) => {
        let ty = 0;
        if (peelStart[k] >= 0) {
          const local = clamp01(g - peelStart[k]);
          const eased = local <= CARD_HOLD ? 0 : smoothstep((local - CARD_HOLD) / (1 - CARD_HOLD));
          ty = -eased * 110;
        }
        card.style.transform = `translateY(${ty}%)`;
      });

      const scrollSec = (ref: RefObject<HTMLDivElement | null>, start: number | undefined) => {
        const c = ref.current;
        if (!c || start == null) return;
        const raw = clamp01((g - start) / SEC_W);
        c.style.transform = `translateY(${vh - raw * c.scrollHeight}px)`;
      };
      scrollSec(planRef, secStart.plan);
      scrollSec(analysisRef, secStart.analysis);
      scrollSec(expRef, secStart.experience);

      // 밝은 스택이 헤더를 덮으면 헤더 라이트 테마 (스택 카드는 모두 밝음)
      const light = coverP >= 0.9;
      if (lightRef.current !== light) {
        lightRef.current = light;
        onLightChange?.(light);
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
  }, [onLightChange]);

  // 푸터·햄버거 메뉴의 섹션(#해시) 링크 → 해당 카드 위치로 스크롤.
  // 진입 시 1회 + 같은 페이지 hashchange 모두 처리. (데스크톱에선 트랙이 숨겨져 no-op)
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const scrollToHash = () => {
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return; // 트랙 숨김(데스크톱 lg+) → SameTrailHero가 처리
      const p = SECTION_PROGRESS[window.location.hash.slice(1)];
      if (p == null) return;
      window.scrollTo(0, el.offsetTop + p * total);
    };
    requestAnimationFrame(scrollToHash);
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <div className="lg:hidden">
      <div ref={trackRef} className="relative" style={{ height: `${TRACK_VH}vh` }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
          {/* 배경 (고정) — hero·인트로 peel 공용 */}
          <Image src="/intro/bg-2.jpg" alt="같은 길, 다른 시선" fill priority sizes="100vw" className="object-cover object-bottom" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 via-[68%] to-transparent to-[97%]" />

          {/* Hero 텍스트 (위로 걷힘) */}
          <div ref={heroFgRef} className="absolute inset-0 z-10 px-[30px] pt-[155px]" style={{ willChange: "transform" }}>
            <h1 className="text-[50px] font-extrabold leading-[1.2] text-[#0ac200]" style={MONT}>
              <span className="block">Same Trail</span>
              <span className="block">New Vision</span>
            </h1>
            <div className="mt-[39px] flex flex-col gap-6 text-white">
              <p className="text-[24px] font-extrabold leading-[0.9] tracking-[-1.2px]">{st.hero.title}</p>
              <div className="text-[18px] leading-[1.45] tracking-[-0.72px]">
                {st.hero.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* 인트로 peel 텍스트 (같은 고정 배경 위로 올라옴 — 배경 이미지 없음) */}
          <div
            ref={introPeelRef}
            className="absolute inset-0 z-[11] flex flex-col items-center justify-center gap-8 px-6 text-center text-white"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            <div className="text-[36px] font-bold leading-[1.2] tracking-[-0.36px]">
              {st.peel.headline.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="text-[18px] leading-[1.5] tracking-[-0.36px]">
              {st.peel.desc.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {/* 밝은 카드 스택 — 밑에서 올라와 덮고, 차례로 peel */}
          <div ref={stackRef} className="absolute inset-0 z-20" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            {/* card: "기획에서 체험까지" 패널 */}
            <div data-card="panel" className="absolute inset-0 flex items-center justify-center bg-[#f0f0f0] px-6" style={{ zIndex: 100, willChange: "transform" }}>
              <div className="text-center text-[28px] font-bold leading-[1.4] tracking-[-0.56px] text-black">
                {panelLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* card: Plan */}
            <Section kind="plan" z={90} mark="Plan" contentRef={planRef}>
              <SecHeader eyebrow={st.plan.eyebrow} title={st.plan.title} subtitle={st.plan.subtitle} />
              <Pic src="/intro/st-plan-1.png" h={218} className="mt-8" />
              <Body lines={st.plan.body1} align="right" className="mt-6" />
              <Pic src="/intro/st-plan-2.jpg" h={367} className="mt-8" />
              <Body lines={st.plan.body2} align="left" className="mt-6 pb-[100px]" />
            </Section>

            {/* card: Analysis */}
            <Section kind="analysis" z={80} mark="Analysis" contentRef={analysisRef}>
              <SecHeader eyebrow={st.analysis.eyebrow} title={st.analysis.title} subtitle={st.analysis.subtitle} />
              <Pic src="/intro/st-analysis-1-cliff.jpg" h={411} className="mt-8" />
              <Body lines={st.analysis.body2} align="right" className="mt-6" />
              <Body lines={st.analysis.body3} align="right" className="mt-4" />
              <Pic src="/intro/st-analysis-2.jpg" h={199} className="mt-8" />
              <Body lines={st.analysis.body1} align="left" className="mt-6 pb-[100px]" />
            </Section>

            {/* card: Experience */}
            <Section kind="experience" z={70} mark="experience" contentRef={expRef}>
              <SecHeader eyebrow={st.experience.eyebrow} title={st.experience.title} subtitle={st.experience.subtitle} />
              <Pic src="/intro/st-exp-1.jpg" h={211} className="mt-8" />
              <Body lines={st.experience.body1} align="right" className="mt-6" />
              <Pic src="/intro/st-exp-2.jpg" h={219} className="mt-8" />
              <Body lines={st.experience.body2} align="left" className="mt-6" />
              <Body lines={st.experience.body3} align="left" className="mt-4 pb-[100px]" />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useT } from "@/i18n/useT";

/** 함께 걷는 사람들 — 모바일(lg 미만) 전용. 카드 스택 peel.
 *  Hero → 단체 카드 4개(KTA → WTN → ATN → GKO)가 차례로 덮고 벗겨짐.
 *  문구는 PC 사전(walkingTogether.*), 로고/링크는 PC 와 동일. */

const TRACK_VH = 520;
const M_COVER = 0.13;
const CARD_HOLD = 0.45;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smoothstep = (x: number) => x * x * (3 - 2 * x);
const MONT = { fontFamily: "var(--font-montserrat)" } as const;

export default function WalkingTogetherMobile({ onLightChange }: { onLightChange?: (light: boolean) => void }) {
  const wt = useT().walkingTogether;
  const trackRef = useRef<HTMLDivElement>(null);
  const heroFgRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef(false);

  // 단체 카드 (Figma 모바일 순서: KTA → WTN → ATN → GKO). org 데이터는 PC 사전, 로고/링크는 PC 와 동일.
  const CARDS = [
    { ...wt.orgs[0], logo: "/intro/wt-org-1.png", href: "https://cafe.daum.net/koreantrails" },
    { ...wt.orgs[2], logo: "/intro/wt-org-2.png", href: "https://worldtrailsnetwork.org" },
    { ...wt.orgs[1], logo: "/intro/wt-org-3.png", href: "https://www.facebook.com/asiatrailsnetwork" },
    { ...wt.orgs[3], logo: "/intro/wt-org-4.png", href: "https://cafe.naver.com/greatkodullers" },
  ];

  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      const coverP = clamp01(progress / M_COVER);
      const peelP = clamp01((progress - M_COVER) / (1 - M_COVER));

      if (heroFgRef.current) heroFgRef.current.style.transform = `translateY(${-coverP * 100}%)`;
      const stack = stackRef.current;
      if (!stack) return;
      stack.style.transform = `translateY(${(1 - coverP) * 100}%)`;

      const cards = stack.querySelectorAll<HTMLElement>("[data-card]");
      const nTrans = cards.length - 1;
      const seg = peelP * nTrans;
      cards.forEach((card, k) => {
        let ty = 0;
        if (k < nTrans) {
          const local = clamp01(seg - k);
          const eased = local <= CARD_HOLD ? 0 : smoothstep((local - CARD_HOLD) / (1 - CARD_HOLD));
          ty = -eased * 110;
        }
        card.style.transform = `translateY(${ty}%)`;
      });

      const light = coverP >= 0.9; // 카드(밝은 배경)가 헤더를 덮으면 라이트 테마
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

  return (
    <div className="lg:hidden">
      <div ref={trackRef} className="relative" style={{ height: `${TRACK_VH}vh` }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
          {/* 배경 (고정) */}
          <Image src="/intro/wt-hero.jpg" alt="함께 걷는 사람들" fill priority sizes="100vw" className="object-cover object-bottom" />
          <div className="pointer-events-none absolute inset-0 bg-black/50" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[30%] to-black/60 to-[97%]" />

          {/* Hero 텍스트 (위로 걷힘) */}
          <div ref={heroFgRef} className="absolute inset-0 z-10 px-[30px] pt-[155px]" style={{ willChange: "transform" }}>
            <h1 className="text-[50px] font-extrabold leading-[1.2] text-[#0ac200]" style={MONT}>
              <span className="block">Walking</span>
              <span className="block">Together</span>
            </h1>
            <div className="mt-[39px] flex flex-col gap-6 text-white">
              <p className="text-[24px] font-extrabold leading-[0.9] tracking-[-1.2px]">{wt.hero.title}</p>
              <div className="text-[16px] leading-[1.45] tracking-[-0.64px]">
                {wt.hero.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* 단체 카드 스택 — 밑에서 올라와 덮고, 차례로 peel */}
          <div ref={stackRef} className="absolute inset-0 z-20" style={{ transform: "translateY(100%)", willChange: "transform" }}>
            {CARDS.map((c, i) => (
              <div
                key={i}
                data-card
                className="absolute inset-0 bg-[#f0f0f0]"
                style={{ zIndex: 100 - i * 10, willChange: "transform" }}
              >
                <div className="flex h-full flex-col items-center px-[18px] pb-[40px] pt-[88px]">
                  {/* 로고 */}
                  <div className="flex h-[180px] items-center justify-center">
                    <img src={c.logo} alt={c.title} className="max-h-[180px] w-auto object-contain" />
                  </div>
                  {/* 제목 + 설명 + 버튼 */}
                  <div className="mt-10 flex w-full max-w-[354px] flex-col gap-8">
                    <div className="flex flex-col gap-6">
                      <p className="text-[30px] font-bold leading-[1.2] tracking-[-0.78px] text-black">{c.title}</p>
                      <p className="text-[16px] leading-[1.5] tracking-[-0.16px] text-[#5a5b5d]">{c.lines.join(" ")}</p>
                    </div>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[60px] w-full items-center justify-center rounded-br-[20px] rounded-tl-[20px] bg-[#0ac200] text-[16px] font-bold tracking-[-0.8px] text-black transition-opacity hover:opacity-90"
                    >
                      {wt.learnMore}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

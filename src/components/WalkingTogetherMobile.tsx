"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useT } from "@/i18n/useT";

/** 함께 걷는 사람들 — 모바일(lg 미만) 전용.
 *  Hero(한 화면) 아래로 단체(KTA → WTN → ATN → GKO)를 하나씩 세로로 스크롤.
 *  내용이 많아(소개·개요·KEY ACTIVITIES·WALKING TOGETHER) 카드 peel 대신 일반 스크롤로 둔다.
 *  문구는 PC 사전(walkingTogether.*), 로고/링크는 PC 와 동일. */

const MONT = { fontFamily: "var(--font-montserrat)" } as const;
const HEADER_H = 64; // 모바일 고정 헤더 높이(해시 스크롤 보정)

/** 자세히 보기 외부링크 아이콘 */
function LinkOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function ActivityBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-bold text-[#0ac200]" style={{ ...MONT, fontSize: 13, letterSpacing: "0.5px" }}>
        {label}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="shrink-0 leading-[1.35] text-[#0ac200]" style={{ fontSize: 15 }}>•</span>
            <span className="leading-[1.35] text-[#3d3d3d]" style={{ fontSize: 15 }}>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WalkingTogetherMobile({ onLightChange }: { onLightChange?: (light: boolean) => void }) {
  const wt = useT().walkingTogether;
  const heroRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef(false);

  // 단체 (Figma 순서: KTA → WTN → ATN → GKO). 사전 orgs 와 로고/링크가 인덱스로 짝지어진다.
  const CARDS = [
    { ...wt.orgs[0], anchor: "kta", logo: "/intro/wt-org-1.png", href: "https://cafe.daum.net/koreantrails" },
    { ...wt.orgs[1], anchor: "wtn", logo: "/intro/wt-org-2.png", href: "https://worldtrailsnetwork.org" },
    { ...wt.orgs[2], anchor: "atn", logo: "/intro/wt-org-3.png", href: "https://www.facebook.com/asiatrailsnetwork" },
    { ...wt.orgs[3], anchor: "gko", logo: "/intro/wt-org-4.png", href: "https://cafe.naver.com/greatkodullers" },
  ];

  // 헤더 테마: 히어로(어두운 배경)를 지나 밝은 단체 섹션이 헤더 밑에 오면 라이트로 전환
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const hero = heroRef.current;
      if (!hero || hero.offsetParent === null) return; // 데스크톱(lg+)에선 모바일 숨김 → 무시
      // 헤더(로고) 뒤에 어두운 히어로가 걸쳐 있으면 흰 로고, 지나가면 어두운 로고.
      // KTA(한국걷는길연합)는 히어로 바로 아래라 앵커 진입 시 히어로 하단이 헤더 영역(≈64)에 걸쳐 있어
      // 흰 로고가 맞고, 스크롤로 그 경계가 헤더 중앙(≈32)을 지나면 어두운 로고로 전환된다.
      const light = hero.getBoundingClientRect().bottom <= 32;
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

  // 푸터·햄버거 메뉴 섹션(#해시) → 해당 단체 섹션으로 스크롤. 진입 1회 + hashchange.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const el = document.getElementById(`m-org-${hash}`);
      if (!el || el.offsetParent === null) return; // 데스크톱(lg+)에선 모바일 숨김 → Hero 가 처리
      const y = window.scrollY + el.getBoundingClientRect().top - HEADER_H;
      window.scrollTo(0, Math.max(y, 0));
    };
    requestAnimationFrame(scrollToHash);
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <div className="lg:hidden">
      {/* Hero (한 화면) */}
      <section ref={heroRef} className="relative h-[100svh] w-full overflow-hidden bg-black">
        <Image src="/intro/wt-hero.jpg" alt="함께 걷는 사람들" fill priority sizes="100vw" className="object-cover object-bottom" />
        <div className="pointer-events-none absolute inset-0 bg-black/50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[30%] to-black/60 to-[97%]" />
        <div className="absolute inset-0 z-10 px-[30px] pt-[155px]">
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
      </section>

      {/* 단체 — 하나씩 세로 스크롤 */}
      <div className="bg-[#f0f0f0]">
        {CARDS.map((c, i) => (
          <section
            key={i}
            id={`m-org-${c.anchor}`}
            className="scroll-mt-[70px] px-[24px] py-[70px]"
            style={{ borderTop: i === 0 ? undefined : "1px solid #e2e2e2" }}
          >
            {/* 로고 */}
            <div className="flex h-[140px] items-center">
              <img src={c.logo} alt={c.title} className="max-h-[140px] w-auto max-w-[200px] object-contain" />
            </div>

            {/* 제목 + 자세히 보기 */}
            <div className="mt-6 flex items-baseline justify-between gap-3">
              <h2 className="font-bold leading-[1.25] tracking-[-0.5px] text-black" style={{ fontSize: 24 }}>
                {c.title}
              </h2>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-1 font-semibold text-[#0ac200]"
                style={{ fontSize: 14 }}
              >
                {wt.learnMore}
                <LinkOut />
              </a>
            </div>

            {/* 소개 */}
            <p className="mt-4 text-[#3d3d3d]" style={{ fontSize: 16, lineHeight: 1.6, letterSpacing: "-0.16px" }}>
              {c.intro}
            </p>

            {/* 개요 불릿 */}
            <div className="mt-5 flex flex-col gap-2.5">
              {c.overview.map((it, j) => (
                <div key={j} className="flex items-start gap-2.5">
                  <span className="mt-[5px] shrink-0 rounded-[1px] bg-[#0ac200]" style={{ width: 4, height: 15 }} />
                  <span className="leading-[1.4] text-[#5a5b5d]" style={{ fontSize: 15 }}>{it}</span>
                </div>
              ))}
            </div>

            {/* KEY ACTIVITIES / WALKING TOGETHER */}
            <div className="mt-8 flex flex-col gap-7">
              <ActivityBlock label="KEY ACTIVITIES" items={c.keyActivities} />
              <ActivityBlock label="WALKING TOGETHER" items={c.together} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

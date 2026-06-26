"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";

/** 우리가 걷는 길 — 모바일(lg 미만) 전용.
 *  Hero + 본문(아코디언). PC 의 가로 탭 캐러셀을 모바일에선 아코디언으로 — 한 번에 하나만 펼쳐짐.
 *  탭별 이미지: /intro/{key}-{n}.jpg (PC 와 동일), 문구는 사전(thePathWeWalk.*). */

const MONT = { fontFamily: "var(--font-montserrat)" } as const;

export default function PathWeWalkMobile({ onLightChange }: { onLightChange?: (light: boolean) => void }) {
  const t = useT().thePathWeWalk;
  const [open, setOpen] = useState<string | null>(null);
  const lightRef = useRef(false);

  // 히어로(어두움)를 지나 아코디언(밝음)이 헤더 아래로 오면 헤더를 라이트 테마로
  useEffect(() => {
    const onScroll = () => {
      const light = window.scrollY > window.innerHeight - 80;
      if (lightRef.current !== light) {
        lightRef.current = light;
        onLightChange?.(light);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onLightChange]);

  // 4개 대섹션 (탭별 이미지 prefix + 특수 옵션)
  const SECTIONS: {
    key: string;
    title: string;
    tabs: { name: string; blocks: { h?: string; lines: string[] }[] }[];
    imgPos?: Record<number, string>;
    video?: Record<number, boolean>;
  }[] = [
    { key: "kdl", title: t.koriaDulegil.title, tabs: t.koriaDulegil.tabs },
    { key: "rr", title: t.regional.title, tabs: t.regional.tabs, imgPos: { 1: "object-bottom" } },
    { key: "cf", title: t.culture.title, tabs: t.culture.tabs, imgPos: { 3: "object-bottom" }, video: { 0: true } },
    { key: "gd", title: t.goods.title, tabs: t.goods.tabs },
  ];

  return (
    <div className="lg:hidden">
      {/* ── Hero ── */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
        <Image src="/intro/pww-hero.jpg" alt="우리가 걷는 길" fill priority sizes="100vw" className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.4)] via-[rgba(33,33,33,0.4)] via-[55%] to-[rgba(0,170,255,0.4)]" />
        <div className="absolute inset-0 z-10 px-[30px] pt-[155px]">
          <h1 className="text-[50px] font-extrabold leading-[1.2] text-[#0ac200]" style={MONT}>
            <span className="block">The Path</span>
            <span className="block">We Walk</span>
          </h1>
          <div className="mt-[39px] flex flex-col gap-6 text-white">
            <p className="text-[24px] font-extrabold leading-[0.9] tracking-[-1.2px]">{t.hero.title}</p>
            <div className="text-[16px] leading-[1.45] tracking-[-0.64px]">
              {t.hero.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 본문 (아코디언) ── */}
      <div className="bg-white">
        {SECTIONS.map((sec, si) => (
          <section key={sec.key}>
            {/* 섹션 헤더 */}
            <div className="flex flex-col gap-[30px] px-[18px] pb-[40px] pt-[70px]">
              {si === 0 && <p className="text-[16px] font-bold leading-[1.1] tracking-[-0.16px] text-black">{t.sectionLabel}</p>}
              <p className="text-[32px] font-bold leading-[1.2] tracking-[-1.6px] text-black">{sec.title}</p>
            </div>

            {/* 탭 아코디언 행 */}
            {sec.tabs.map((tab, i) => {
              const id = `${sec.key}-${i}`;
              const isOpen = open === id;
              return (
                <div key={id} className="border-b-2 border-[#f0f0f0]">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between px-[34px] py-[20px] text-left"
                  >
                    <span className={`text-[15px] font-extrabold leading-[1.1] tracking-[-0.15px] transition-colors ${isOpen ? "text-black" : "text-[#bdbdbd]"}`}>
                      {tab.name}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className={`shrink-0 transition-transform ${isOpen ? "rotate-180 text-black" : "text-[#bdbdbd]"}`}
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </button>

                  {/* 펼침/접힘 모션 — grid 0fr↔1fr 로 높이를 부드럽게 전환 */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div
                      className={`min-h-0 overflow-hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                    >
                      <div className="px-[18px] pb-8">
                        <div className="relative overflow-hidden rounded-br-[40px] rounded-tl-[40px]">
                          <img
                            src={`/intro/${sec.key}-${i + 1}.jpg`}
                            alt=""
                            loading="lazy"
                            className={`h-[200px] w-full object-cover ${sec.imgPos?.[i] ?? "object-center"}`}
                          />
                          {sec.video?.[i] && (
                            <>
                              <div className="absolute inset-0 bg-black/30" />
                              <svg
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="#ffffff"
                                aria-hidden
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </>
                          )}
                        </div>
                        <div className="mt-6 flex flex-col gap-5">
                          {tab.blocks.map((b, bi) => (
                            <div key={bi} className="flex flex-col gap-2">
                              {b.h && <p className="text-[15px] font-bold leading-[1.3] tracking-[-0.45px] text-black">{b.h}</p>}
                              <div className="text-[14px] leading-[1.5] tracking-[-0.42px] text-[#5a5b5d]">
                                {b.lines.map((l, li) => (
                                  <p key={li}>{l}</p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}

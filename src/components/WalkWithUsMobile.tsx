"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";

/** 마음잇기 — 모바일(lg 미만) 전용. Hero + 탭(후원하기 · 연간기금 및 활동실적).
 *  PC WalkWithUsContent 의 데이터를 모바일 레이아웃으로 재구성. */

const MONT = { fontFamily: "var(--font-montserrat)" } as const;
const TABS = ["donation", "annual"] as const;
type Tab = (typeof TABS)[number];
const ACCOUNT_NO = "301-0061-8049-01";

export default function WalkWithUsMobile({ onLightChange }: { onLightChange?: (light: boolean) => void }) {
  const w = useT().walkWithUs;
  const [tab, setTab] = useState<Tab>("donation");
  const [copied, setCopied] = useState(false);
  const lightRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 히어로(어두움) 지나 밝은 콘텐츠가 헤더 아래로 오면 라이트 테마
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

  // 푸터 서브메뉴 해시(#donation/#annual)로 탭 활성화
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (h === "donation" || h === "annual") setTab(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const copyAccount = async () => {
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(ACCOUNT_NO);
      } else {
        // 비보안 컨텍스트(폰에서 http IP 접속 등) 폴백 — 임시 textarea + execCommand
        const ta = document.createElement("textarea");
        ta.value = ACCOUNT_NO;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 무시 */
    }
  };

  const d = w.donation;
  const annualItems = Array.from({ length: 10 }, () => ({ date: "2026.03", title: w.annual.sampleTitle }));

  return (
    <div className="lg:hidden">
      {/* ── Hero ── */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
        <Image src="/intro/ww-hero.jpg" alt="마음잇기" fill priority sizes="100vw" className="object-cover object-bottom" />
        <div className="pointer-events-none absolute inset-0 bg-black/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[40%] to-black/55 to-[97%]" />
        <div className="absolute inset-0 z-10 px-[30px] pt-[155px]">
          <h1 className="text-[50px] font-extrabold leading-[1.2] text-[#0ac200]" style={MONT}>
            <span className="block">Walk</span>
            <span className="block">with Us</span>
          </h1>
          <div className="mt-[39px] flex flex-col gap-[24px] text-white">
            <p className="text-[24px] font-extrabold leading-[0.9] tracking-[-1.2px]">{w.hero.title}</p>
            <p className="text-[16px] leading-[1.45] tracking-[-0.64px]">{w.hero.desc}</p>
          </div>
        </div>
      </section>

      {/* ── 본문 (탭) ── */}
      <div className="bg-[#f0f0f0] pb-[120px] pt-[70px]">
        {/* 탭 바 */}
        <div className="flex justify-center gap-[14px]">
          {TABS.map((key) => {
            const active = key === tab;
            return (
              <button key={key} type="button" onClick={() => setTab(key)} className="flex flex-col items-center">
                <span className={`mb-1 size-[5px] rounded-full ${active ? "bg-[#0ac200]" : "bg-transparent"}`} />
                <span className={`whitespace-nowrap text-[16px] font-bold leading-[1.3] tracking-[-0.4px] ${active ? "text-black" : "text-[#d9d9d9]"}`}>
                  {w.tabs[key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ===== 후원하기 ===== */}
        {tab === "donation" && (
          <div className="mt-[40px] px-[18px]">
            {/* 이미지 + 헤드라인 */}
            <div className="relative overflow-hidden rounded-br-[40px] rounded-tl-[40px]">
              <img src="/intro/ww-donate.jpg" alt="" className="h-[480px] w-full object-cover object-bottom" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent px-6 pb-7 pt-16 text-white">
                <p className="text-[20px] font-bold leading-[1.2] tracking-[-0.4px]">{d.headline}</p>
                <div className="mt-3 text-[14px] leading-[1.5] tracking-[-0.28px]">
                  {d.desc.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* 계좌 카드 */}
            <div className="mt-6 rounded-br-[32px] rounded-tl-[32px] bg-white px-6 py-7">
              <div className="flex items-center gap-3">
                <span className="w-[60px] shrink-0 text-[16px] leading-[1.2] tracking-[-0.42px] text-black">{d.account}</span>
                <span className="text-[18px] font-bold leading-[1.2] tracking-[-0.47px] text-black">{d.accountNo}</span>
                <button
                  type="button"
                  onClick={copyAccount}
                  aria-label={d.copyAria}
                  className="ml-auto flex size-[30px] shrink-0 items-center justify-center rounded-br-[10px] rounded-tl-[10px] bg-[#0ac200]"
                >
                  {copied ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 12l5 5 9-9" stroke="#231f20" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect x="8" y="8" width="12" height="12" rx="2" stroke="#231f20" strokeWidth="1.6" />
                      <path d="M4 16V5a1 1 0 011-1h11" stroke="#231f20" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="w-[60px] shrink-0 text-[16px] leading-[1.2] tracking-[-0.42px] text-black">{d.holder}</span>
                <span className="text-[18px] leading-[1.2] tracking-[-0.47px] text-black">{d.holderName}</span>
              </div>
              <p className="mt-2 pl-[72px] text-[15px] leading-[1.3] tracking-[-0.3px] text-[#0ac200]">{d.note}</p>

              <div className="my-6 h-px w-full bg-[#d9d9d9]" />

              <p className="text-[16px] font-semibold leading-[1.2] text-black">{d.usageTitle}</p>
              <ul className="mt-3 list-disc pl-5 text-[15px] leading-[1.5] tracking-[-0.39px] text-black">
                {d.usage.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ===== 연간기금 및 활동실적 ===== */}
        {tab === "annual" && (
          <div className="mt-[40px] px-[18px]">
            <div className="flex flex-col">
              {annualItems.map((it, i) => (
                <div key={i} className="flex items-center gap-[18px] border-t border-[#c6c6c6] py-4">
                  <span className="shrink-0 text-[14px] font-bold leading-none text-[#9c9c9c]" style={MONT}>
                    {it.date}
                  </span>
                  <span className="text-[18px] font-bold leading-[1.3] tracking-[-0.36px] text-black">{it.title}</span>
                </div>
              ))}
            </div>
            {/* 페이지네이션 */}
            <div className="mt-10 flex items-center justify-center gap-5">
              <button type="button" aria-label="이전" className="flex size-9 items-center justify-center rounded-full border border-[#c6c6c6] text-[#9c9c9c]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-4">
                {["01", "02", "03", "04", "05"].map((p, i) => (
                  <span key={p} className="text-[14px] font-medium" style={{ ...MONT, color: i === 0 ? "#000000" : "#bdbdbd" }}>
                    {p}
                  </span>
                ))}
              </div>
              <button type="button" aria-label="다음" className="flex size-9 items-center justify-center rounded-full border border-[#c6c6c6] text-[#231f20]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

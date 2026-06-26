"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/useT";

/** 알리는 이야기 — 모바일(lg 미만) 전용. Hero + 탭(공지사항·소식받기·문의하기).
 *  PC 컴포넌트(NoticesSection/SubscribeSection/InquirySection)의 데이터를 모바일 레이아웃으로 재구성. */

const MONT = { fontFamily: "var(--font-montserrat)" } as const;
const TABS = ["notices", "subscribe", "contact"] as const;
type Tab = (typeof TABS)[number];
const FIXED_DOMAINS = ["gmail.com", "naver.com", "daum.net", "kakao.com"];
const SUB_IMGS = ["/intro/os-sub-1.jpg", "/intro/os-sub-2.jpg", "/intro/os-sub-3.jpg"];
const UNDERLINE =
  "w-full border-0 border-b border-[#9c9c9c] bg-transparent pb-2 text-[16px] text-black outline-none placeholder:text-[#c5c5c5] focus:border-[#0ac200]";

/** 필수 표시 점 */
function Req() {
  return <span className="ml-1 inline-block size-[5px] shrink-0 rounded-full bg-[#0ac200] align-top" />;
}

/** 라벨(위) + 필드(아래) — 모바일 세로 스택 */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-start text-[16px] font-bold leading-[1.3] tracking-[-0.16px] text-black">
        {label}
        <Req />
      </p>
      {children}
    </div>
  );
}

/** 이메일 입력 + @ + 도메인 선택 (공용) */
function EmailField({ placeholder, direct }: { placeholder: string; direct: string }) {
  const domains = [...FIXED_DOMAINS, direct];
  return (
    <div className="flex flex-wrap items-end gap-2 text-[16px]">
      <input type="text" className={`${UNDERLINE} w-[140px]`} placeholder={placeholder} />
      <span className="pb-2 text-black" style={MONT}>
        @
      </span>
      <div className="relative flex-1">
        <select className={`${UNDERLINE} cursor-pointer appearance-none pr-6`} style={MONT} defaultValue="gmail.com">
          {domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute bottom-3 right-1" width="11" height="6" viewBox="0 0 11 6" fill="none" aria-hidden>
          <path d="M1 1l4.5 4L10 1" stroke="#231f20" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function Heading({ lines }: { lines: string[] }) {
  return (
    <div className="text-[20px] font-bold leading-[1.3] tracking-[-0.4px] text-black">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
}

export default function OurStoriesMobile({ onLightChange }: { onLightChange?: (light: boolean) => void }) {
  const t = useT();
  const hero = t.ourStories.hero;
  const [tab, setTab] = useState<Tab>("notices");
  const [interest, setInterest] = useState("");
  const [agree, setAgree] = useState(false);
  const lightRef = useRef(false);

  // 히어로(어두움)를 지나 밝은 콘텐츠가 헤더 아래로 오면 라이트 테마
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

  // 푸터 서브메뉴 해시(#notices/#subscribe/#contact)로 탭 활성화
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if ((TABS as readonly string[]).includes(h)) setTab(h as Tab);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const notices = Array.from({ length: 5 }, () => ({
    title: t.notices.sampleTitle,
    body: t.notices.sampleBody,
    date: t.notices.sampleDate,
  }));

  return (
    <div className="lg:hidden">
      {/* ── Hero ── */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
        <Image src="/intro/os-hero.jpg" alt="알리는 이야기" fill priority sizes="100vw" className="object-cover object-bottom" />
        <div className="pointer-events-none absolute inset-0 bg-black/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-black/60 to-[97%]" />
        <div className="absolute inset-0 z-10 px-[30px] pt-[155px]">
          <h1 className="text-[50px] font-extrabold leading-[1.2] text-[#0ac200]" style={MONT}>
            <span className="block">Our</span>
            <span className="block">Stories</span>
          </h1>
          <div className="mt-[39px] flex flex-col gap-[24px] text-white">
            <p className="text-[24px] font-extrabold leading-[0.9] tracking-[-1.2px]">{hero.title}</p>
            <div className="text-[16px] leading-[1.45] tracking-[-0.64px]">
              {hero.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
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
              <button key={key} type="button" onClick={() => setTab(key)} className="flex w-[72px] flex-col items-center">
                <span className={`mb-1 size-[5px] rounded-full ${active ? "bg-[#0ac200]" : "bg-transparent"}`} />
                <span className={`text-[16px] font-bold leading-[1.3] tracking-[-0.4px] ${active ? "text-black" : "text-[#d9d9d9]"}`}>
                  {t.notices.tabs[key === "contact" ? "contact" : key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ===== 공지사항 ===== */}
        {tab === "notices" && (
          <div className="mt-[60px] px-[18px]">
            <Heading lines={t.notices.noticesHeading} />
            {/* 검색 */}
            <div className="mt-6 flex h-[53px] items-center gap-2 rounded-full bg-white px-5">
              <p className="flex-1 text-[16px] text-[#bdbdbd]">{t.notices.search}</p>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="#231f20" strokeWidth="1.6" />
                <path d="M16.5 16.5L21 21" stroke="#231f20" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            {/* 카드 목록 */}
            <div className="mt-8 flex flex-col">
              {notices.map((n, i) => (
                <Link
                  key={i}
                  href={`/our-stories/notices/${i + 1}`}
                  onClick={() => sessionStorage.setItem("os:notices", "1")}
                  className="block border-t border-[#c6c6c6] py-6"
                >
                  <div className="flex h-[180px] items-center justify-center overflow-hidden rounded-br-[30px] rounded-tl-[30px] bg-white">
                    <img src="/intro/logo-dark.svg" alt="" className="h-9 w-auto opacity-90" />
                  </div>
                  <p className="mt-5 text-[18px] font-semibold leading-[1.3] tracking-[-0.36px] text-black">{n.title}</p>
                  <p className="mt-3 line-clamp-2 text-[14px] leading-[1.5] tracking-[-0.28px] text-black">{n.body}</p>
                  <p className="mt-3 text-[13px] font-bold text-[#c6c6c6]" style={MONT}>
                    {n.date}
                  </p>
                </Link>
              ))}
            </div>
            {/* 페이지네이션 */}
            <div className="mt-8 flex items-center justify-center gap-5">
              <button type="button" aria-label="이전" className="flex size-9 items-center justify-center rounded-full border border-[#c6c6c6] text-[#9c9c9c]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-4">
                {["01", "02", "03", "04", "05"].map((p, i) => (
                  <span key={p} className="text-[14px] font-medium" style={{ ...MONT, color: i === 0 ? "#231f20" : "#bdbdbd" }}>
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

        {/* ===== 소식받기 ===== */}
        {tab === "subscribe" && (
          <div className="mt-[60px] px-[18px]">
            <Heading lines={t.subscribe.heading} />
            <form className="mt-12 flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
              <Field label={t.subscribe.labels.name}>
                <input type="text" className={UNDERLINE} placeholder={t.subscribe.namePlaceholder} />
              </Field>
              <Field label={t.subscribe.labels.phone}>
                <div className="flex items-end gap-3 text-[16px]">
                  <span className="pb-2 text-black">010</span>
                  <span className="pb-2 text-black">-</span>
                  <input type="tel" inputMode="numeric" maxLength={4} className={`${UNDERLINE} flex-1 text-center`} placeholder="0000" />
                  <span className="pb-2 text-black">-</span>
                  <input type="tel" inputMode="numeric" maxLength={4} className={`${UNDERLINE} flex-1 text-center`} placeholder="0000" />
                </div>
              </Field>
              <Field label={t.subscribe.labels.email}>
                <EmailField placeholder={t.subscribe.emailPlaceholder} direct={t.subscribe.emailDirect} />
              </Field>
              <Field label={t.subscribe.labels.interests}>
                <div className="flex flex-col gap-3">
                  {t.subscribe.interests.map((v) => {
                    const on = interest === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setInterest(on ? "" : v)}
                        className={`flex h-[53px] items-center rounded-full px-5 text-[16px] font-bold transition-colors ${
                          on ? "bg-[#0ac200] text-black" : "bg-white text-[#5a5b5d]"
                        }`}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <div className="h-px w-full bg-[#c6c6c6]" />
              {/* 동의 + 신청 */}
              <div className="flex flex-col items-center gap-6">
                <button type="button" onClick={() => setAgree((v) => !v)} className="flex items-center gap-3">
                  <span className={`flex size-6 items-center justify-center rounded-[4px] border ${agree ? "border-[#0ac200] bg-[#0ac200]" : "border-[#9c9c9c] bg-white"}`}>
                    {agree && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M5 12l5 5 9-9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[14px] text-black">{t.subscribe.consent}</span>
                </button>
                <button
                  type="submit"
                  disabled={!agree}
                  className="flex h-[56px] w-full items-center justify-center rounded-br-[20px] rounded-tl-[20px] bg-[#0ac200] text-[16px] font-bold text-black transition-opacity disabled:opacity-40"
                >
                  {t.subscribe.submit}
                </button>
              </div>
            </form>

            {/* 안내 카드 3개 */}
            <div className="mt-[100px] flex flex-col gap-[60px]">
              {t.subscribe.cards.map((c, ci) => (
                <div key={ci} className="flex flex-col items-center gap-[30px]">
                  <div className="relative aspect-square w-full overflow-hidden rounded-br-[40px] rounded-tl-[40px] bg-[#d9d9d9]">
                    <Image src={SUB_IMGS[ci]} alt={c.title} fill sizes="354px" className="object-cover" />
                  </div>
                  <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-[20px] font-extrabold leading-[1.1] tracking-[-0.2px] text-black">{c.title}</p>
                    <div className="text-[14px] leading-[1.5] tracking-[-0.14px] text-[#5a5b5d]">
                      {c.lines.map((l, i) => (
                        <p key={i}>{l}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 문의하기 ===== */}
        {tab === "contact" && (
          <div className="mt-[60px] px-[18px]">
            <Heading lines={t.inquiry.heading} />
            <form className="mt-12 flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
              <Field label={t.inquiry.labels.name}>
                <input type="text" className={UNDERLINE} placeholder={t.inquiry.namePlaceholder} />
              </Field>
              <Field label={t.inquiry.labels.email}>
                <EmailField placeholder={t.inquiry.emailPlaceholder} direct={t.inquiry.emailDirect} />
              </Field>
              <Field label={t.inquiry.labels.content}>
                <textarea
                  rows={6}
                  className="w-full resize-y border border-[#464444] bg-transparent p-3 text-[16px] leading-[1.5] text-black outline-none placeholder:text-[#bdbdbd] focus:border-[#0ac200]"
                  placeholder={t.inquiry.contentPlaceholder}
                />
              </Field>
              <div className="h-px w-full bg-[#c6c6c6]" />
              <button
                type="submit"
                className="flex h-[50px] w-full items-center justify-center rounded-br-[20px] rounded-tl-[20px] bg-[#0ac200] text-[16px] font-bold text-black"
              >
                {t.inquiry.submit}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

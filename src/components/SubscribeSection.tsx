"use client";

import Image from "next/image";
import { useState } from "react";
import { useT } from "@/i18n/useT";

/** "05. 알리는 이야기 > 소식받기" 탭 패널 — 소식 신청 폼 + 안내 카드 3개 (텍스트는 사전).
 *  NoticesSection 탭에서 활성화 시 렌더. 정적 폼(실제 전송 로직 없음). */

const FIXED_DOMAINS = ["gmail.com", "naver.com", "daum.net", "kakao.com"];
const CARD_IMGS = ["/intro/os-sub-1.jpg", "/intro/os-sub-2.jpg", "/intro/os-sub-3.jpg"];

/** 필수 표시 점 */
function Req() {
  return <span className="ml-1 inline-block size-[5px] shrink-0 rounded-full bg-[#0ac200] align-top" />;
}

/** 라벨(20px Bold) + 필드 한 줄. 라벨 폭 고정, 모바일에서는 세로 스택 */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
      <p className="flex w-[220px] shrink-0 items-start font-bold text-black" style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: "-0.2px" }}>
        {label}
        <Req />
      </p>
      <div className="flex-1">{children}</div>
    </div>
  );
}

const underline = "border-0 border-b border-[#9c9c9c] bg-transparent pb-2 text-[20px] text-black outline-none placeholder:text-[#c5c5c5] focus:border-[#0ac200]";

export default function SubscribeSection() {
  const t = useT().subscribe;
  const emailDomains = [...FIXED_DOMAINS, t.emailDirect];
  const [interest, setInterest] = useState<string>("");
  const [agree, setAgree] = useState(false);

  return (
    <div className="flex flex-col px-[50px]">
      {/* 헤딩 */}
      <div className="font-bold text-black" style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.624px" }}>
        {t.heading.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* 폼 */}
      <form
        className="mt-[100px] flex flex-col gap-[60px]"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* 성함 */}
        <Field label={t.labels.name}>
          <input type="text" className={`${underline} w-full max-w-[320px]`} placeholder={t.namePlaceholder} />
        </Field>

        {/* 연락처 */}
        <Field label={t.labels.phone}>
          <div className="flex items-end gap-[18px]" style={{ fontSize: 20 }}>
            <span className="pb-2 text-black">010</span>
            <span className="pb-2 text-black">-</span>
            <input type="tel" inputMode="numeric" maxLength={4} className={`${underline} w-[120px] text-center`} placeholder="0000" />
            <span className="pb-2 text-black">-</span>
            <input type="tel" inputMode="numeric" maxLength={4} className={`${underline} w-[120px] text-center`} placeholder="0000" />
          </div>
        </Field>

        {/* 이메일 */}
        <Field label={t.labels.email}>
          <div className="flex flex-wrap items-end gap-[14px]" style={{ fontSize: 20 }}>
            <input type="text" className={`${underline} w-[240px]`} placeholder={t.emailPlaceholder} />
            <span className="pb-2 text-black" style={{ fontFamily: "var(--font-montserrat)" }}>@</span>
            <div className="relative">
              <select className={`${underline} w-[180px] cursor-pointer appearance-none pr-6`} style={{ fontFamily: "var(--font-montserrat)" }} defaultValue="gmail.com">
                {emailDomains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute bottom-3 right-1" width="11" height="6" viewBox="0 0 11 6" fill="none">
                <path d="M1 1l4.5 4L10 1" stroke="#231f20" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Field>

        {/* 관심분야 */}
        <Field label={t.labels.interests}>
          <div className="flex flex-wrap gap-[19px]">
            {t.interests.map((v) => {
              const on = interest === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setInterest(v)}
                  className={`flex h-[52px] w-[232px] cursor-pointer items-center justify-center rounded-full font-bold transition-colors ${
                    on ? "bg-[#0ac200] text-black" : "bg-white text-black hover:bg-[#e9e9e9]"
                  }`}
                  style={{ fontSize: 16, letterSpacing: "-0.16px" }}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </Field>

        {/* 구분선 */}
        <div className="h-px w-full bg-[#c6c6c6]" />

        {/* 동의 + 신청 */}
        <div className="flex flex-wrap items-center justify-end gap-[40px]">
          <button
            type="button"
            onClick={() => setAgree((v) => !v)}
            className="flex cursor-pointer items-center gap-[16px]"
          >
            <span
              className={`flex size-[24px] items-center justify-center rounded-[4px] border ${
                agree ? "border-[#0ac200] bg-[#0ac200]" : "border-[#9c9c9c] bg-white"
              }`}
            >
              {agree && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5 9-9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-black" style={{ fontSize: 16, letterSpacing: "-0.16px" }}>
              {t.consent}
            </span>
          </button>
          <button
            type="submit"
            disabled={!agree}
            className="flex h-[60px] w-[256px] cursor-pointer items-center justify-center rounded-br-[20px] rounded-tl-[20px] bg-[#0ac200] font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ fontSize: 16, letterSpacing: "-0.8px" }}
          >
            {t.submit}
          </button>
        </div>
      </form>

      {/* 안내 카드 3개 */}
      <div className="mt-[160px] grid grid-cols-1 gap-x-[80px] gap-y-[60px] md:grid-cols-2 xl:grid-cols-3">
        {t.cards.map((c, ci) => (
          <div key={ci} className="flex flex-col items-center gap-[30px]">
            <div className="relative size-[320px] overflow-hidden rounded-br-[40px] rounded-tl-[40px] bg-[#d9d9d9]">
              <Image src={CARD_IMGS[ci]} alt={c.title} fill sizes="320px" className="object-cover" />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-extrabold text-black" style={{ fontSize: 20, lineHeight: 1.1, letterSpacing: "-0.2px" }}>
                {c.title}
              </p>
              <div style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.18px", color: "#5a5b5d", maxWidth: 320 }}>
                {c.lines.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

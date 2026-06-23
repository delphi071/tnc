"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** 복사할 계좌번호 */
const ACCOUNT_NO = "301-0061-8049-01";

const TAB_KEYS = ["donation", "annual"] as const;
type TabKey = (typeof TAB_KEYS)[number];

/** "06. 마음잇기 contents" 콘텐츠 컬럼 (1920 스테이지 좌표).
 *  탭(후원하기 / 연간기금)으로 본문 전환. WalkWithUsHero 의 peel 스크롤 컬럼 안에서 사용. */
export default function WalkWithUsContent() {
  const t = useT().walkWithUs;
  const [tab, setTab] = useState<TabKey>("donation");
  const [copied, setCopied] = useState(false);

  // 푸터 서브메뉴 해시(#donation/#annual)로 진입 시 해당 탭 활성화
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (h === "donation" || h === "annual") setTab(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyAccount = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(ACCOUNT_NO);
      } else {
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
      /* 복사 실패 시 무시 */
    }
  };

  return (
    <>
      {/* 탭 */}
      <div className="absolute flex items-end gap-[60px]" style={{ left: 410, top: 140 }}>
        {TAB_KEYS.map((key) => {
          const active = key === tab;
          return (
            <button key={key} type="button" onClick={() => setTab(key)} className="flex cursor-pointer flex-col items-start">
              {active && <span className="size-[12px] rounded-full bg-[#0ac200]" />}
              <p className="whitespace-nowrap font-bold" style={{ fontSize: 32, lineHeight: 1.3, letterSpacing: "-0.832px", color: active ? "#000000" : "#d9d9d9" }}>
                {t.tabs[key]}
              </p>
            </button>
          );
        })}
      </div>

      {tab === "donation" ? (
        <DonationBody copied={copied} onCopy={copyAccount} />
      ) : (
        <AnnualBody />
      )}
    </>
  );
}

/** 후원하기 본문 — 풀블리드 석양 이미지 + 후원 안내(계좌) 카드 */
function DonationBody({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  const d = useT().walkWithUs.donation;
  // 영문 계좌번호("NH Bank …")는 한글("농협 …")보다 길어 복사 버튼/툴팁을 오른쪽으로 이동
  const en = useLocale().locale === "en";
  const copyLeft = en ? 516 : 456;
  return (
    <>
      {/* 풀블리드 석양 이미지 */}
      <div className="absolute" style={{ left: 0, top: 296, width: 1920, height: 868 }}>
        <Image src="/intro/ww-donate.jpg" alt="" fill sizes="1920px" className="object-cover object-bottom" />
      </div>

      {/* 후원 안내 블록 */}
      <div className="absolute flex flex-col gap-[50px]" style={{ left: 410, top: 892, width: 1100 }}>
        {/* 헤드라인 (이미지 위, 흰 글씨, 우측 정렬) */}
        <div className="flex flex-col items-end gap-[24px] text-white">
          <p className="w-full font-bold" style={{ fontSize: 30, lineHeight: 1.2, letterSpacing: "-0.78px" }}>
            {d.headline}
          </p>
          <div className="w-full" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.468px" }}>
            {d.desc.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        {/* 계좌 카드 */}
        <div className="relative w-full rounded-br-[60px] rounded-tl-[60px] bg-white" style={{ height: 243 }}>
          <p className="absolute font-normal text-black" style={{ left: 60, top: 86, fontSize: 20, lineHeight: 1.2, letterSpacing: "-0.52px" }}>
            {d.account}
          </p>
          <p className="absolute whitespace-nowrap font-bold text-black" style={{ left: 170, top: 83, fontSize: 24, lineHeight: 1.2, letterSpacing: "-0.624px" }}>
            {d.accountNo}
          </p>
          {/* 복사 버튼 */}
          <button
            type="button"
            onClick={onCopy}
            aria-label={d.copyAria}
            className="absolute flex cursor-pointer items-center justify-center rounded-br-[10px] rounded-tl-[10px] bg-[#0ac200] transition-opacity hover:opacity-90"
            style={{ left: copyLeft, top: 82, width: 30, height: 30 }}
          >
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5 9-9" stroke="#231f20" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="8" y="8" width="12" height="12" rx="2" stroke="#231f20" strokeWidth="1.6" />
                <path d="M4 16V5a1 1 0 011-1h11" stroke="#231f20" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </button>
          {copied && (
            <span
              className="absolute whitespace-nowrap rounded-full bg-[#231f20] px-3 py-1 font-medium text-white"
              style={{ left: copyLeft + 40, top: 80, fontSize: 14, lineHeight: 1.6 }}
            >
              {d.copied}
            </span>
          )}
          <p className="absolute font-normal text-black" style={{ left: 60, top: 124, fontSize: 20, lineHeight: 1.2, letterSpacing: "-0.52px" }}>
            {d.holder}
          </p>
          <p className="absolute whitespace-nowrap font-normal text-black" style={{ left: 170, top: 121, fontSize: 24, lineHeight: 1.2, letterSpacing: "-0.624px" }}>
            {d.holderName}
          </p>
          <p className="absolute whitespace-nowrap font-normal text-[#0ac200]" style={{ left: 170, top: 165, fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.36px" }}>
            {d.note}
          </p>

          {/* 세로 구분선 */}
          <div className="absolute bg-[#d9d9d9]" style={{ left: 612, top: 53, width: 1, height: 147.5 }} />

          {/* 우측: 후원금 사용처 */}
          <p className="absolute whitespace-nowrap font-semibold text-black" style={{ left: 673, top: 67, fontSize: 20, lineHeight: 1.2 }}>
            {d.usageTitle}
          </p>
          <ul className="absolute list-disc text-black" style={{ left: 700, top: 105, fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.468px" }}>
            {d.usage.map((it, i) => (
              <li key={i} className="whitespace-nowrap">{it}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

/** 연간기금 및 활동실적 내역 본문 — date + title 리스트 + 페이지네이션 */
function AnnualBody() {
  const title = useT().walkWithUs.annual.sampleTitle;
  const items = Array.from({ length: 10 }, () => ({ date: "2026.03", title }));
  return (
    <div className="absolute flex flex-col items-center gap-[80px]" style={{ left: 410, top: 294, width: 1100 }}>
      {/* 리스트 */}
      <div className="w-full">
        {items.map((it, i) => (
          <div
            key={i}
            className="group flex h-[66px] cursor-pointer items-center gap-[57px] border-t border-[#c6c6c6] px-[50px] transition-colors hover:bg-[#0ac200]"
          >
            <p className="font-bold text-[#9c9c9c] group-hover:text-white" style={{ fontFamily: "var(--font-montserrat)", fontSize: 15, lineHeight: 1 }}>
              {it.date}
            </p>
            <p className="font-bold text-black" style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: "-0.4px" }}>
              {it.title}
            </p>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center gap-[51px]">
        <button type="button" aria-label="이전" className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#c6c6c6] text-[#9c9c9c]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-[28px]">
          {["01", "02", "03", "04", "05"].map((p, i) => (
            <span
              key={p}
              className="cursor-pointer font-medium"
              style={{ fontFamily: "var(--font-montserrat)", fontSize: 18, lineHeight: 1, color: i === 0 ? "#000000" : "#bdbdbd" }}
            >
              {p}
            </span>
          ))}
        </div>
        <button type="button" aria-label="다음" className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#c6c6c6] text-[#231f20]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

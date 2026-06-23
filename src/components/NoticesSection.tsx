"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/useT";
import SubscribeSection from "./SubscribeSection";
import InquirySection from "./InquirySection";

/** "05. 알리는 이야기" 밝은(#f0f0f0) 콘텐츠. 히어로 뒤 일반 스크롤로 등장.
 *  상단 탭으로 공지사항 / 소식받기 / 추가될 게시판 / 문의하기 패널 전환. */

const TAB_KEYS = ["notices", "subscribe", "comingSoon", "contact"] as const;
type TabKey = (typeof TAB_KEYS)[number];

type BoardItem = { title: string; body: string; date: string };

export default function NoticesSection() {
  const t = useT();
  const [tab, setTab] = useState<TabKey>("notices");

  // 푸터 서브메뉴 해시(#notices/#subscribe/#contact)로 진입 시 해당 탭 활성화
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if ((TAB_KEYS as readonly string[]).includes(h)) setTab(h as TabKey);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  /** 공지사항 게시판 데이터 (샘플 5개) */
  const notices: BoardItem[] = Array.from({ length: 5 }, () => ({
    title: t.notices.sampleTitle,
    body: t.notices.sampleBody,
    date: t.notices.sampleDate,
  }));

  /** "추가될 메뉴" — 추후 들어올 게시판 자리(placeholder) */
  const placeholder: BoardItem[] = Array.from({ length: 5 }, () => ({
    title: t.notices.placeholderTitle,
    body: t.notices.placeholderBody,
    date: t.notices.sampleDate,
  }));

  return (
    <section className="w-full bg-[#f0f0f0] px-6 pb-[200px] pt-[120px] xl:px-[360px]">
      <div className="mx-auto w-full max-w-[1100px]">
        {/* 탭 */}
        <div className="flex items-end gap-[60px] pl-[50px]">
          {TAB_KEYS.map((key) => {
            const active = key === tab;
            return (
              <button key={key} type="button" onClick={() => setTab(key)} className="flex cursor-pointer flex-col items-start">
                {active && <span className="mb-1 size-[10px] rounded-full bg-[#0ac200]" />}
                <p
                  className="whitespace-nowrap font-bold"
                  style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.624px", color: active ? "#000000" : "#d9d9d9" }}
                >
                  {t.notices.tabs[key]}
                </p>
              </button>
            );
          })}
        </div>

        {/* 패널 */}
        <div className="mt-[100px]">
          {tab === "notices" && (
            <BoardPanel heading={t.notices.noticesHeading} items={notices} hrefBase="/our-stories/notices" search={t.notices.search} />
          )}
          {tab === "subscribe" && <SubscribeSection />}
          {tab === "comingSoon" && <BoardPanel heading={t.notices.comingSoonHeading} items={placeholder} search={t.notices.search} />}
          {tab === "contact" && <InquirySection />}
        </div>
      </div>
    </section>
  );
}

/** 게시판 패널 — 헤딩 + 검색 + 카드 목록 + 페이지네이션. 탭별로 별도 데이터를 받아 독립 렌더.
 *  hrefBase가 주어지면 각 카드를 `${hrefBase}/${i+1}` 상세로 이동하는 링크로 렌더 */
function BoardPanel({ heading, items, hrefBase, search }: { heading: string[]; items: BoardItem[]; hrefBase?: string; search: string }) {
  return (
    <div className="flex flex-col gap-[30px] px-[50px]">
      <div className="flex items-center justify-between gap-[20px]">
        <div className="font-bold text-black" style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.624px" }}>
          {heading.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <div className="flex h-[53px] w-[400px] max-w-[55%] shrink-0 items-center gap-[10px] rounded-full bg-white px-5">
          <p className="flex-1 font-bold text-[#d9d9d9]" style={{ fontSize: 16, letterSpacing: "-0.16px" }}>
            {search}
          </p>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <circle cx="11" cy="11" r="7" stroke="#231f20" strokeWidth="1.6" />
            <path d="M16.5 16.5L21 21" stroke="#231f20" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col">
        {items.map((n, i) => {
          const cardClass =
            "flex items-center gap-[40px] border-t-[0.5px] border-[#c6c6c6] px-[30px] py-[50px] transition-colors duration-200 hover:bg-[#0ac200]";
          const inner = (
            <>
              <div className="flex h-[167px] w-[300px] shrink-0 items-center justify-center overflow-hidden rounded-br-[30px] rounded-tl-[30px] bg-white">
                <img src="/intro/logo-dark.svg" alt="" className="h-10 w-auto opacity-90" />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-4 self-stretch pt-6">
                <div className="flex flex-col gap-[14px] text-black">
                  <p className="font-semibold" style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: "-0.4px" }}>
                    {n.title}
                  </p>
                  <p className="line-clamp-2" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.36px" }}>
                    {n.body}
                  </p>
                </div>
                <p className="font-bold text-[#c6c6c6]" style={{ fontSize: 15, fontFamily: "var(--font-montserrat)" }}>
                  {n.date}
                </p>
              </div>
            </>
          );
          return hrefBase ? (
            <Link
              key={i}
              href={`${hrefBase}/${i + 1}`}
              className={cardClass}
              // 상세에서 뒤로가기로 돌아오면 히어로가 아닌 공지 리스트로 복귀하도록 표시
              onClick={() => sessionStorage.setItem("os:notices", "1")}
            >
              {inner}
            </Link>
          ) : (
            <div key={i} className={cardClass}>
              {inner}
            </div>
          );
        })}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-[50px] flex items-center justify-center gap-[40px]">
        <button type="button" aria-label="이전" className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#c6c6c6] text-[#9c9c9c]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-[28px]">
          {["01", "02", "03", "04", "05"].map((p, i) => (
            <span
              key={p}
              className="font-medium"
              style={{ fontSize: 16, fontFamily: "var(--font-montserrat)", color: i === 0 ? "#231f20" : "#bdbdbd" }}
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

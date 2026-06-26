"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/useT";
import Header from "./Header";
import SiteFooter from "./SiteFooter";

/** Figma "05. 알리는 이야기" 공지사항 상세 (node 1560:16919).
 *  목록 → 제목/날짜 → 본문 + 포스터 → 이전/다음 글 네비게이션.
 *  내용은 샘플(고정)이며, 실제 데이터는 백엔드에서 id로 연동 예정. */

export default function NoticeDetail() {
  const t = useT();
  const d = t.noticeDetail;
  const [scale, setScale] = useState(1);

  // 화면 폭에 맞춰 푸터 스테이지 균일 축소 (1920 기준)
  useEffect(() => {
    const onResize = () => setScale(Math.min(1, window.innerWidth / 1920));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <Header active="ourStories" fixed theme="light" />

      <main className="min-h-screen w-full bg-[#f0f0f0] pt-[68px] lg:pt-[80px] xl:pt-[102px]">
        <section className="px-6 pb-[200px] pt-[140px] xl:px-[120px]">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
            {/* 목록으로 */}
            <Link
              href="/our-stories#notices"
              className="flex w-fit items-center gap-1.5 py-2.5 text-[#9c9c9c] transition-colors hover:text-[#231f20]"
              // 히어로가 아닌 공지 리스트 위치로 이동
              onClick={() => sessionStorage.setItem("os:notices", "1")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 16, letterSpacing: "-0.16px" }}>{d.list}</span>
            </Link>

            {/* 제목 + 날짜 */}
            <div className="flex items-center justify-between gap-5 border-b border-[#c6c6c6] py-6">
              <h1 className="font-bold text-black" style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.624px" }}>
                {d.title}
              </h1>
              <span className="shrink-0 font-bold text-[#c6c6c6]" style={{ fontSize: 15, fontFamily: "var(--font-montserrat)" }}>
                {d.date}
              </span>
            </div>

            {/* 본문 + 포스터 */}
            <div className="flex flex-col gap-[57px] border-b border-[#c6c6c6] px-0 pb-[50px] pt-[30px] sm:px-[30px]">
              <p className="whitespace-pre-line text-black" style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.18px" }}>
                {d.body}
              </p>
              <Image
                src="/intro/os-notice-poster.jpg"
                alt={d.posterAlt}
                width={1200}
                height={1697}
                sizes="(max-width: 1200px) 100vw, 1140px"
                className="h-auto w-full"
              />
            </div>

            {/* 이전 / 다음 글 (더미) */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                aria-label={d.prev}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#c6c6c6] text-[#9c9c9c] transition-colors hover:border-[#231f20] hover:text-[#231f20]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label={d.next}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#c6c6c6] text-[#231f20] transition-colors hover:border-[#231f20]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter scale={scale} />
    </>
  );
}

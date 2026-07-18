"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

/** "05. 알리는 이야기" 게시판 패널 공용 조각.
 *  - GalleryPanel : 활동현황 (Figma KO 1712:5495 / EN 1712:7791) — 3열 갤러리형
 *  - ListPanel    : 자료실   (Figma KO 1712:6289 / EN 1712:8796) — 날짜+제목 리스트형
 *  공지사항(NoticesSection 의 BoardPanel)과 헤딩·검색창·페이지네이션 구성을 공유한다. */

/** 목록 → 상세 이동 시, 뒤로 돌아왔을 때 히어로가 아닌 해당 탭으로 복귀시키기 위한 표시 */
export function markReturnToBoard() {
  sessionStorage.setItem("os:notices", "1");
}

/** 헤딩(여러 줄) + 검색창 — 세 패널이 동일하게 쓴다 */
export function BoardHeader({ heading, search }: { heading: string[]; search: string }) {
  return (
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
  );
}

/** 페이지네이션 — Figma: 이전=연회색 박스 / 다음=초록 박스 (좌상단·우하단 라운드) */
export function Pagination() {
  return (
    <div className="mt-[50px] flex items-center justify-center gap-[51px]">
      <button type="button" aria-label="이전" className="flex size-10 cursor-pointer items-center justify-center rounded-br-[10px] rounded-tl-[10px] bg-[#d9d9d9] text-[#231f20] transition-opacity hover:opacity-90">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="flex items-center gap-[28px]">
        {["01", "02", "03", "04", "05"].map((p, i) => (
          <span key={p} className="font-medium" style={{ fontSize: 16, fontFamily: "var(--font-montserrat)", color: i === 0 ? "#231f20" : "#bdbdbd" }}>
            {p}
          </span>
        ))}
      </div>
      <button type="button" aria-label="다음" className="flex size-10 cursor-pointer items-center justify-center rounded-br-[10px] rounded-tl-[10px] bg-[#0ac200] text-[#231f20] transition-opacity hover:opacity-90">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export type GalleryItem = { title: string; date: string };

/** 활동현황 — 3열 갤러리. 카드 hover 시 썸네일이 초록으로 덮이며 화살표가 뜬다(Figma 첫 카드 상태). */
export function GalleryPanel({
  heading,
  items,
  hrefBase,
  search,
}: {
  heading: string[];
  items: GalleryItem[];
  hrefBase: string;
  search: string;
}) {
  return (
    <div className="flex flex-col gap-[30px] px-[50px]">
      <BoardHeader heading={heading} search={search} />

      <div className="grid grid-cols-3 gap-x-[30px] gap-y-[40px]">
        {items.map((it, i) => (
          <Link key={i} href={`${hrefBase}/${i + 1}`} onClick={markReturnToBoard} className="group flex flex-col gap-[14px]">
            {/* 썸네일 — 실제 이미지가 들어오기 전까지 로고 플레이스홀더 */}
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-white">
              <img src="/intro/logo-dark.svg" alt="" className="h-9 w-auto opacity-90 transition-opacity duration-200 group-hover:opacity-0" />
              <div className="absolute inset-0 flex items-center justify-center bg-[#0ac200] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 12h15M13 6l6 6-6 6" stroke="#231f20" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="font-semibold text-black" style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: "-0.4px" }}>
                {it.title}
              </p>
              <p className="font-bold text-[#c6c6c6]" style={{ fontSize: 15, fontFamily: "var(--font-montserrat)" }}>
                {it.date}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <Pagination />
    </div>
  );
}

export type ListItem = { title: string; date: string };

/** 자료실 — 날짜 + 제목 한 줄 리스트.
 *  Figma 실측: 행 높이 66 / 좌우 50 / 날짜·제목 간격 57 / 행마다 상단 경계선 #c6c6c6.
 *  hover 는 Figma 의 "채워진 행"(#0ac200) 상태를 그대로 쓴다 — 그 상태에서도 글자색은 바뀌지 않는다. */
export function ListPanel({
  heading,
  items,
  hrefBase,
  search,
}: {
  heading: string[];
  items: ListItem[];
  hrefBase: string;
  search: string;
}) {
  return (
    <div className="flex flex-col gap-[30px] px-[50px]">
      <BoardHeader heading={heading} search={search} />

      <div className="flex flex-col">
        {items.map((it, i) => (
          <Link
            key={i}
            href={`${hrefBase}/${i + 1}`}
            onClick={markReturnToBoard}
            className="flex h-[66px] items-center gap-[57px] whitespace-nowrap border-t border-[#c6c6c6] px-[50px] transition-colors duration-200 hover:bg-[#0ac200]"
          >
            <span className="shrink-0 font-bold text-[#9c9c9c]" style={{ fontSize: 15, lineHeight: 1, fontFamily: "var(--font-montserrat)" }}>
              {it.date}
            </span>
            <span className="font-semibold text-black" style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: "-0.4px" }}>
              {it.title}
            </span>
          </Link>
        ))}
      </div>

      <Pagination />
    </div>
  );
}

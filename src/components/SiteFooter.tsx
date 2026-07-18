"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";
import { COL_HREFS, COL_SUB_HREFS } from "@/i18n/navLinks";

/** Figma footer (1920×519, #231f20). 약도 다음 일반 스크롤로 등장. */
const STAGE_W = 1920;
/** 링크 줄과 하단 정보 사이 간격 / 푸터 맨 아래 여백 (1920 스테이지 좌표) */
const GAP_TO_INFO = 75;
const PAD_BOTTOM = 88;

/** 링크 줄 그리드 — 헤더와 같은 칸 폭을 쓰되, 스테이지 폭을 다 채우지 않고 가운데 정렬한다.
 *  헤더는 오른쪽에 아이콘 영역(약 365)이 있어 메뉴 칸이 216 인데, 푸터엔 그게 없다.
 *  같은 216 을 쓰면 1920 에서 364 가 남으므로 그걸 좌우로 반씩 나눠 가운데로 보이게 한다. */
const LOGO_COL_W = 260; // 헤더 로고 칸과 동일
const MENU_COL_W = 216; // 헤더 메뉴 칸과 동일
const GRID_W = LOGO_COL_W + MENU_COL_W * 6; // 1556

const SEP = "  |  ";

export default function SiteFooter({ scale }: { scale: number }) {
  const t = useT();
  // 스테이지는 1920 좌표로 조판한 뒤 scale 로 줄인다. transform 은 레이아웃 높이를 바꾸지 않으므로
  // 원본 높이를 재서 footer 높이에 scale 을 곱해준다. 메뉴가 늘거나 언어가 바뀌어 줄 수가
  // 달라져도 자동으로 맞으므로, 예전처럼 높이를 상수로 못 박아 두다 잘리는 일이 없다.
  const stageRef = useRef<HTMLDivElement>(null);
  // 메뉴 줄 아래 구분선은 화면 끝까지 그어야 해서 칸의 border 가 아니라 별도 요소로 그린다.
  // 그 y 위치를 알려면 메뉴 줄의 실제 높이가 필요하다.
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowH, setRowH] = useState(0);
  // 초기값은 실측 전(SSR·첫 페인트) 높이가 0 이 되어 화면이 튀지 않게 하는 근사치일 뿐,
  // 마운트 직후 실측값으로 교체된다.
  const [stageH, setStageH] = useState(520);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setStageH(el.offsetHeight);
      if (rowRef.current) setRowH(rowRef.current.offsetHeight);
    });
    ro.observe(el);
    setStageH(el.offsetHeight);
    if (rowRef.current) setRowH(rowRef.current.offsetHeight);
    return () => ro.disconnect();
  }, []);
  const { toggle, locale } = useLocale();
  const { cols, info, foundation, mobileInfo } = t.footer;
  const pathname = usePathname();

  // 같은 페이지의 섹션 링크는 Next 라우팅(pushState)이 hashchange 를 발생시키지 않으므로
  // 해시를 직접 바꿔(또는 동일 시 이벤트를 수동 발생) 히어로의 스크롤 로직을 트리거한다.
  const handleSubClick = (e: React.MouseEvent, href: string) => {
    const i = href.indexOf("#");
    if (i < 0) return;
    if (href.slice(0, i) !== pathname) return; // 다른 페이지면 일반 이동
    e.preventDefault();
    const hash = href.slice(i);
    if (window.location.hash === hash) window.dispatchEvent(new Event("hashchange"));
    else window.location.hash = hash;
  };

  return (
    <>
    {/* ── 모바일 푸터 (lg 미만) — Figma "Group 92" ── */}
    <footer className="bg-[#231f20] text-[#737373] lg:hidden">
      {/* 로고 + 재단명 */}
      <div className="flex flex-col items-center gap-3 px-6 pb-8 pt-[50px]">
        <img src="/intro/footer-bt.svg" alt="Beyond the Route" className="h-[100px] w-auto" />
        <p className="text-[14px] font-semibold text-[#c6c6c6]" style={{ fontFamily: "var(--font-montserrat)" }}>
          {foundation}
        </p>
      </div>

      {/* 6메뉴 2단 그리드 */}
      <div className="grid grid-cols-2 border-t border-[#5a5b5d]">
        {cols.map((c, ci) => (
          <Link
            key={ci}
            href={COL_HREFS[ci]}
            className="border-b border-[#5a5b5d] px-6 py-6 text-[16px] text-[#9c9c9c] transition-colors hover:text-white [&:nth-child(odd)]:border-r"
          >
            {c.h}
          </Link>
        ))}
      </div>

      {/* 로고 + 정부 배지 */}
      <div className="flex items-center justify-between px-6 pb-5 pt-8">
        <img src="/intro/logo.svg" alt="한국의길과문화" className="h-[40px] w-auto" />
        <div className="flex items-center gap-4">
          <a href="https://www.acrc.go.kr/" target="_blank" rel="noopener noreferrer" aria-label="국민권익위원회">
            <img src="/intro/footer-badge-acrc.png" alt="국민권익위원회" className="h-[18px] w-auto" />
          </a>
          <a href="https://www.nts.go.kr" target="_blank" rel="noopener noreferrer" aria-label="국세청">
            <img src="/intro/footer-badge-nts.png" alt="국세청" className="h-[19px] w-auto" />
          </a>
        </div>
      </div>

      {/* 사업자 정보 — 모바일 줄 구성(mobileInfo). EN은 줄간격 12px(gap-3), KO는 기존 4px(gap-1) */}
      <div className={`flex flex-col ${locale === "en" ? "gap-3" : "gap-1"} px-6 pb-10 text-[13px] leading-[1.5]`}>
        {mobileInfo.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </footer>

    {/* ── 데스크톱 푸터 (lg+) — 1920 스케일 스테이지 ── */}
    <footer className="relative hidden w-full overflow-hidden bg-[#231f20] lg:block" style={{ height: stageH * scale }}>
      {/* 메뉴 줄 아래 구분선 — 스테이지(1920) 밖에 두어 넓은 해상도에서도 화면 끝까지 그어진다 */}
      <div className="pointer-events-none absolute inset-x-0" style={{ top: rowH * scale, height: 1, backgroundColor: "#5a5b5d" }} />
      <div
        ref={stageRef}
        className="absolute left-1/2 top-0"
        style={{ width: STAGE_W, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center", paddingBottom: PAD_BOTTOM }}
      >
        {/* 상단: 로고 + 링크 6컬럼 — 높이는 내용에 맞춰 늘어난다(고정값 두면 링크가 늘 때 잘림).
            폭은 GRID_W(1556)로 고정하고 mx-auto 로 가운데 정렬 → 좌우에 182px 씩 남는다. */}
        <div ref={rowRef} className="mx-auto flex items-stretch" style={{ width: GRID_W }}>
          <div className="flex shrink-0 flex-col items-center justify-center gap-4 px-6" style={{ width: LOGO_COL_W }}>
            <img src="/intro/footer-bt.svg" alt="Beyond the Route" style={{ width: 191, height: 101.7 }} />
            <p className="text-center font-semibold" style={{ fontSize: 12, color: "#c6c6c6", fontFamily: "var(--font-montserrat)" }}>
              {foundation}
            </p>
          </div>
          {cols.map((c, ci) => (
            // min-w-0: flex 아이템 기본값(min-width:auto)이면 긴 링크가 컬럼 폭을 밀어내
            // 컬럼마다 폭이 제각각이 된다. 0 으로 풀어야 6컬럼이 균등폭으로 나뉜다.
            <div key={ci} className="flex shrink-0 flex-col gap-5 border-l px-5 pb-5 pt-[60px]" style={{ width: MENU_COL_W, borderColor: "#5a5b5d" }}>
              <Link href={COL_HREFS[ci]} className="max-w-full font-extrabold transition-colors hover:text-white" style={{ fontSize: 18, color: "#9c9c9c", lineHeight: 1.3, letterSpacing: "-0.36px" }}>{c.h}</Link>
              <div className="flex flex-col gap-3">
                {c.links.map((l, li) => {
                  const subHref = COL_SUB_HREFS[ci]?.[li];
                  // nowrap 제거: 균등폭 안에서 긴 영문 라벨은 줄바꿈시킨다
                  const style = { fontSize: 18, color: "#737373", lineHeight: 1.4, letterSpacing: "-0.9px" };
                  return subHref ? (
                    <Link key={li} href={subHref} onClick={(e) => handleSubClick(e, subHref)} className="max-w-full transition-colors hover:text-white" style={style}>{l}</Link>
                  ) : (
                    <p key={li} style={style}>{l}</p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 하단: 로고 + 정보 + 소셜 */}
        <div className="mx-auto flex items-center gap-[77px]" style={{ marginTop: GAP_TO_INFO, width: GRID_W }}>
          <img src="/intro/logo.svg" alt="한국의길과문화" className="shrink-0" style={{ width: 143, height: 60 }} />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex flex-col gap-2" style={{ fontSize: 14, color: "#737373" }}>
              <p>{info.line1.join(SEP)}</p>
              <p>{info.line2.join(SEP)}</p>
              <p>{info.line3.join(SEP)}</p>
            </div>
            {/* 정부 배지 + 소셜 — Figma footer 504px 컨테이너(배지 좌 / 소셜 우, justify-between) */}
            <div className="flex shrink-0 items-center justify-between" style={{ width: 504 }}>
              <div className="flex items-center gap-[17.5px]">
                <a href="https://www.acrc.go.kr/" target="_blank" rel="noopener noreferrer" aria-label="국민권익위원회" className="transition-opacity hover:opacity-70">
                  <img src="/intro/footer-badge-acrc.png" alt="국민권익위원회" style={{ height: 28, width: "auto" }} />
                </a>
                <a href="https://www.nts.go.kr" target="_blank" rel="noopener noreferrer" aria-label="국세청" className="transition-opacity hover:opacity-70">
                  <img src="/intro/footer-badge-nts.png" alt="국세청" style={{ height: 28, width: "auto" }} />
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-[30px]">
                <a href="https://www.instagram.com/koreatnc1" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-opacity hover:opacity-70">
                  <img src="/intro/ic-instagram.svg" alt="" style={{ width: 24, height: 24 }} />
                </a>
                <a href="https://smartstore.naver.com/koreatnc" target="_blank" rel="noopener noreferrer" aria-label="Store" className="transition-opacity hover:opacity-70">
                  <img src="/intro/ic-store.svg" alt="" style={{ width: 24, height: 24 }} />
                </a>
                <span style={{ width: 1, height: 20, backgroundColor: "#9c9c9c" }} />
                <button type="button" onClick={toggle} aria-label={t.header.language} title={locale === "ko" ? "English" : "한국어"} className="cursor-pointer transition-opacity hover:opacity-70">
                  <img src="/intro/ic-language.svg" alt="" style={{ width: 24, height: 24 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}

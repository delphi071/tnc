"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";
import { COL_HREFS, COL_SUB_HREFS } from "@/i18n/navLinks";

/** Figma footer (1920×519, #231f20). 약도 다음 일반 스크롤로 등장. */
const STAGE_W = 1920;
export const FOOTER_H = 519;

const SEP = "  |  ";

export default function SiteFooter({ scale }: { scale: number }) {
  const t = useT();
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
    <footer className="relative hidden w-full overflow-hidden bg-[#231f20] lg:block" style={{ height: FOOTER_H * scale }}>
      <div className="absolute left-1/2 top-0" style={{ width: STAGE_W, height: FOOTER_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}>
        {/* 상단: 로고 + 링크 6컬럼 */}
        <div className="absolute left-0 top-0 flex w-full items-stretch" style={{ height: 293 }}>
          <div className="flex w-[557px] shrink-0 flex-col items-end justify-center gap-5 border-b px-20" style={{ borderColor: "#5a5b5d" }}>
            <img src="/intro/footer-bt.svg" alt="Beyond the Route" style={{ width: 191, height: 101.7 }} />
            <p className="text-right font-semibold" style={{ fontSize: 12, color: "#c6c6c6", fontFamily: "var(--font-montserrat)" }}>
              {foundation}
            </p>
          </div>
          {cols.map((c, ci) => (
            <div key={ci} className="flex flex-1 flex-col gap-5 border-b border-l px-5 pb-5 pt-[60px]" style={{ borderColor: "#5a5b5d" }}>
              <Link href={COL_HREFS[ci]} className="font-extrabold transition-colors hover:text-white" style={{ fontSize: 18, color: "#9c9c9c", lineHeight: 1.3, letterSpacing: "-0.36px", width: "fit-content" }}>{c.h}</Link>
              <div className="flex flex-col gap-3">
                {c.links.map((l, li) => {
                  const subHref = COL_SUB_HREFS[ci]?.[li];
                  const style = { fontSize: 18, color: "#737373", lineHeight: 1.4, letterSpacing: "-0.9px", whiteSpace: "nowrap" as const };
                  return subHref ? (
                    <Link key={li} href={subHref} onClick={(e) => handleSubClick(e, subHref)} className="transition-colors hover:text-white" style={{ ...style, width: "fit-content" }}>{l}</Link>
                  ) : (
                    <p key={li} style={style}>{l}</p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 하단: 로고 + 정보 + 소셜 */}
        <div className="absolute flex items-center gap-[77px]" style={{ left: 335, top: 368, width: 1357 }}>
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

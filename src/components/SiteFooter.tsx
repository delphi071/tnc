"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** 대메뉴(컬럼 제목) 링크 — cols 순서와 동일 (헤더 메뉴와 동일 경로) */
const COL_HREFS = ["/our-way", "/same-trail", "/the-path-we-walk", "/walking-together", "/our-stories", "/walk-with-us"];

/** 서브메뉴 링크 — [컬럼index][링크index]. 각 항목을 해당 페이지의 섹션(#해시)으로 연결.
 *  핀-스크롤 페이지는 해시로 섹션 위치까지 스크롤, 탭 페이지는 해시로 탭 활성화. */
const COL_SUB_HREFS: Record<number, string[]> = {
  0: ["/our-way#mission", "/our-way#vision", "/our-way#history", "/our-way#people", "/our-way#location"],
  1: ["/same-trail#plan", "/same-trail#analysis", "/same-trail#experience"],
  2: ["/the-path-we-walk#korea", "/the-path-we-walk#regional", "/the-path-we-walk#culture", "/the-path-we-walk#goods"],
  3: ["/walking-together#kta", "/walking-together#atn", "/walking-together#wtn", "/walking-together#gko"],
  4: ["/our-stories#notices", "/our-stories#subscribe", "/our-stories#contact"],
  5: ["/walk-with-us#donation", "/walk-with-us#annual"],
};

/** Figma footer (1920×519, #231f20). 약도 다음 일반 스크롤로 등장. */
const STAGE_W = 1920;
export const FOOTER_H = 519;

const SEP = "  |  ";

export default function SiteFooter({ scale }: { scale: number }) {
  const t = useT();
  const { toggle, locale } = useLocale();
  const { cols, info, foundation } = t.footer;
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
    <footer className="relative w-full overflow-hidden bg-[#231f20]" style={{ height: FOOTER_H * scale }}>
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
    </footer>
  );
}

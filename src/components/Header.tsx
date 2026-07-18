"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";
import { COL_HREFS, COL_SUB_HREFS } from "@/i18n/navLinks";

/** 상단 GNB — Figma "00. main" 헤더 (모든 화면 공통).
 *  active: 현재 섹션 메뉴 키를 초록색으로 강조 (한글/영문 무관하게 키로 매칭)
 *  theme: "light" → 밝은 배경용 (어두운 로고/아이콘, 검정 메뉴, 회색 외곽선)
 *  우측 지구본 아이콘 = 한국어/영어 토글 */
export type NavKey =
  | "ourWay"
  | "sameTrail"
  | "thePathWeWalk"
  | "walkingTogether"
  | "ourStories"
  | "walkWithUs";

const MENU: { key: NavKey; href: string }[] = [
  { key: "ourWay", href: "/our-way" },
  { key: "sameTrail", href: "/same-trail" },
  { key: "thePathWeWalk", href: "/the-path-we-walk" },
  { key: "walkingTogether", href: "/walking-together" },
  { key: "ourStories", href: "/our-stories" },
  { key: "walkWithUs", href: "/walk-with-us" },
];

export default function Header({
  active,
  fixed,
  theme = "dark",
}: {
  active?: NavKey;
  fixed?: boolean;
  theme?: "dark" | "light";
}) {
  const t = useT();
  const { locale, toggle } = useLocale();
  const pathname = usePathname();
  const cols = t.footer.cols; // 모바일 메뉴 = 푸터 컬럼(제목+하위링크)과 동일 텍스트/링크
  const light = theme === "light";
  const sfx = light ? "-dark" : "";
  const menuColor = light ? "text-[#231f20]" : "text-white";
  const border = light ? "border-[#c6c6c6]" : "border-white/15";
  const headerBorder = light ? "border-[#c6c6c6]" : "border-white/20";
  const divider = light ? "bg-[#bdbdbd]" : "bg-white/40";

  // 모바일 메뉴 (lg 미만 전용).
  //  animateMenu: 햄버거(열기)·X(닫기)는 슬라이드, 메뉴/로고 선택은 즉시(무애니메이션)로 닫고 이동.
  const [menuOpen, setMenuOpen] = useState(false);
  const [animateMenu, setAnimateMenu] = useState(true);

  // PC GNB 서브메뉴(드롭다운) — hover한 대메뉴 인덱스. null = 닫힘. state로 제어해 hover 안정 + 이동 시 닫힘.
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const openMenu = () => {
    setAnimateMenu(true);
    setMenuOpen(true);
  }; // 햄버거 → 위에서 아래로 펼침
  const closeMenu = () => {
    setAnimateMenu(true);
    setMenuOpen(false);
  }; // X → 위로 슬라이드하며 닫힘
  const selectMenu = () => {
    setAnimateMenu(false);
    setMenuOpen(false);
  }; // 메뉴/로고 선택 → 즉시 닫고 화면 이동

  // 모바일 메뉴 서브링크 클릭: 메뉴를 닫고, 같은 페이지의 섹션(#해시)이면
  // 직접 해시를 바꿔(또는 동일 시 이벤트 수동 발생) 히어로 스크롤 로직을 트리거.
  // 다른 페이지면 Next 라우팅에 맡긴다. (SiteFooter.handleSubClick 과 동일 동작)
  const handleSubLink = (e: React.MouseEvent, href: string) => {
    selectMenu();
    setOpenIdx(null); // PC 드롭다운 닫기
    const i = href.indexOf("#");
    if (i < 0) return;
    if (href.slice(0, i) !== pathname) return; // 다른 페이지면 일반 이동
    e.preventDefault();
    const hash = href.slice(i);
    if (window.location.hash === hash) window.dispatchEvent(new Event("hashchange"));
    else window.location.hash = hash;
  };

  // PC 대메뉴 클릭: 같은 페이지면 맨 위로 스크롤(해시 제거), 다른 페이지면 일반 이동. 드롭다운 닫기.
  const handleMainClick = (e: React.MouseEvent, href: string) => {
    setOpenIdx(null);
    if (href !== pathname) return; // 다른 페이지면 Next 라우팅(자동 top)
    e.preventDefault();
    if (window.location.hash) history.replaceState(null, "", pathname); // 섹션 해시 제거
    window.scrollTo(0, 0);
  };

  // 메뉴 열린 동안 본문 스크롤 잠금
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  return (
    <>
    <header
      className={`${fixed ? "fixed" : "absolute"} inset-x-0 top-0 z-50 border-b ${headerBorder} bg-white/[0.04] backdrop-blur-[9px] transition-colors duration-300 lg:backdrop-blur-[2px]`}
    >
      {/* 모바일 (lg 미만): 로고 중앙 + 우측 햄버거 (Figma 모바일 헤더, 높이 64) */}
      <div className="relative flex h-16 items-center justify-center px-6 lg:hidden">
        <Link href="/" aria-label={t.header.home} className="flex items-center">
          <img src={`/intro/logo${sfx}.svg`} alt="한국의길과문화" className="h-[30px] w-auto" />
        </Link>
        <button
          type="button"
          aria-label={locale === "en" ? "Menu" : "메뉴"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={openMenu}
          className={`absolute right-6 top-1/2 -translate-y-1/2 ${menuColor} transition-colors`}
        >
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" aria-hidden>
            <line x1="0" y1="1.5" x2="24" y2="1.5" />
            <line x1="0" y1="9" x2="24" y2="9" />
            <line x1="0" y1="16.5" x2="24" y2="16.5" />
          </svg>
        </button>
      </div>

      {/* 데스크톱 (lg+): 기존 GNB (로고 + 메뉴 + 아이콘) */}
      <div className="mx-auto hidden h-[80px] w-full max-w-[1920px] items-center lg:flex xl:h-[102px]">
        {/* 로고 (왼쪽 고정) → 인트로 */}
        <Link
          href="/"
          aria-label={t.header.home}
          className={`flex h-full shrink-0 items-center px-6 lg:w-[208px] lg:justify-center lg:border-r ${border} xl:w-[260px]`}
        >
          <img src={`/intro/logo${sfx}.svg`} alt="한국의길과문화" className="h-8 w-auto xl:h-10" />
        </Link>

        {/* 메뉴 (남는 폭을 균등하게 채움) — hover한 대메뉴의 서브메뉴를 그 아래에 표시.
            state(openIdx)로 제어: 전체폭 바 위에서 hover가 끊기지 않고, 페이지 이동 시 닫힌다. */}
        <nav
          className="relative hidden h-full flex-1 items-stretch lg:flex"
          onMouseLeave={() => setOpenIdx(null)}
        >
          {MENU.map((item, ci) => {
            const subLinks = cols[ci]?.links ?? [];
            return (
              <div
                key={item.key}
                className={`relative flex flex-1 items-stretch border-r ${border}`}
                onMouseEnter={() => setOpenIdx(ci)}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleMainClick(e, item.href)}
                  // 영문 메뉴는 Figma 기준 Montserrat ExtraBold (한글은 기본 Pretendard)
                  style={locale === "en" ? { fontFamily: "var(--font-montserrat)" } : undefined}
                  className={`flex flex-1 items-center justify-center whitespace-nowrap px-2 text-[14px] font-extrabold tracking-[-0.3px] transition-colors hover:text-[#0ac200] xl:text-[15px] ${
                    item.key === active ? "text-[#0ac200]" : menuColor
                  }`}
                >
                  {t.header.nav[item.key]}
                </Link>
                {/* 서브메뉴: 대메뉴 아래(top-full). min-w-full 로 컬럼 폭을 채워 라벨에서 곧장 내려와도 hover가 끊기지 않게 한다. */}
                {openIdx === ci && subLinks.length > 0 && (
                  <div
                    className={`absolute top-full z-40 flex h-[80px] min-w-full items-center gap-6 whitespace-nowrap px-3 xl:h-[102px] ${
                      ci === 5 ? "right-0" : "left-0"
                    }`}
                    style={locale === "en" ? { fontFamily: "var(--font-montserrat)" } : undefined}
                  >
                    {subLinks.map((l, li) => {
                      const href = COL_SUB_HREFS[ci]?.[li];
                      const cls = `text-[13px] font-semibold tracking-[-0.2px] transition-colors hover:text-[#0ac200] xl:text-[14px] ${
                        light ? "text-[#231f20]/75" : "text-white/75"
                      }`;
                      return href ? (
                        <Link key={li} href={href} onClick={(e) => handleSubLink(e, href)} className={cls}>
                          {l}
                        </Link>
                      ) : (
                        <span key={li} className={cls}>
                          {l}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 아이콘 (오른쪽 고정) */}
        <div className="flex shrink-0 items-center gap-5 px-6 xl:gap-[30px] xl:px-[50px]">
          <IconLink href="https://www.instagram.com/koreatnc1" external label={t.header.icons.instagram}>
            <img src={`/intro/ic-instagram${sfx}.svg`} alt="" className="size-[26px] xl:size-[30px]" />
          </IconLink>
          <IconLink href="https://smartstore.naver.com/koreatnc" external label={t.header.icons.store}>
            <img src={`/intro/ic-store${sfx}.svg`} alt="" className="size-[26px] xl:size-[30px]" />
          </IconLink>
          {/* 지도(route) 아이콘 → 우리가 걷는 길 > 코리아둘레길 > 완보 인증 탭 */}
          <IconLink
            href="/the-path-we-walk#certifications"
            label={t.header.icons.certifications}
            onClick={(e) => handleSubLink(e, "/the-path-we-walk#certifications")}
          >
            <img src={`/intro/ic-route${sfx}.svg`} alt="" className="size-[26px] xl:size-[30px]" />
          </IconLink>
          <span className={`h-[25px] w-px ${divider}`} />
          {/* 언어 토글 (한국어 ↔ 영어) */}
          <button
            type="button"
            onClick={toggle}
            aria-label={t.header.language}
            title={locale === "ko" ? "English" : "한국어"}
            className="flex cursor-pointer items-center gap-1.5 transition-opacity hover:opacity-70"
          >
            <img src={`/intro/ic-language${sfx}.svg`} alt="" className="size-[26px] xl:size-[30px]" />
            <span className={`text-[13px] font-extrabold ${menuColor}`} style={{ fontFamily: "var(--font-montserrat)" }}>
              {locale === "ko" ? "KO" : "EN"}
            </span>
          </button>
        </div>
      </div>

    </header>

      {/* PC 서브메뉴 배경 바 — 헤더 밖(형제)에 둔다: 헤더의 backdrop-filter 안에 중첩하면
          뒷배경(페이지 콘텐츠)이 격리돼 블러가 안 먹으므로 분리. 헤더 바로 아래 띠 전체 폭을 블러. */}
      <div
        aria-hidden
        className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-x-0 top-[80px] z-40 hidden h-[80px] border-b ${headerBorder} bg-white/[0.04] backdrop-blur-[2px] transition-opacity duration-200 lg:block xl:top-[102px] xl:h-[102px] ${
          openIdx !== null ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 모바일 메뉴 (lg 미만) — header 밖(형제)에 둔다.
          header 의 backdrop-filter 가 fixed 의 기준 박스가 되어 전체화면이 깨지므로 분리.
          위 → 아래 슬라이드, 배경 블러. 닫기: X 버튼 / 메뉴 항목 선택 / ESC. */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[60] flex flex-col border-b-[0.3px] ${headerBorder} bg-white/[0.01] backdrop-blur-[18px] lg:hidden ${
          animateMenu ? "transition-transform duration-500 ease-in-out" : ""
        } ${menuOpen ? "translate-y-0" : "pointer-events-none -translate-y-full"}`}
      >
        {/* 상단 바: 로고 중앙 + 닫기 버튼 (햄버거 아이콘 유지) */}
        <div className="relative flex h-16 shrink-0 items-center justify-center px-6">
          <Link
            href="/"
            aria-label={t.header.home}
            onClick={selectMenu}
            className="flex items-center"
          >
            <img src={`/intro/logo${sfx}.svg`} alt="한국의길과문화" className="h-[30px] w-auto" />
          </Link>
          <button
            type="button"
            aria-label={locale === "en" ? "Close menu" : "메뉴 닫기"}
            onClick={closeMenu}
            className={`absolute right-6 top-1/2 -translate-y-1/2 ${menuColor} transition-colors`}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" aria-hidden>
              <line x1="3" y1="3" x2="19" y2="19" />
              <line x1="19" y1="3" x2="3" y2="19" />
            </svg>
          </button>
        </div>

        {/* 메뉴 리스트 — 6개 컬럼 균등 높이(flex-1), 0.3px 구분선.
            각 컬럼 = 대제목(=현재 페이지면 초록) + 하위 링크 행(가로, 줄바꿈).
            텍스트·링크는 푸터 컬럼(t.footer.cols / navLinks)과 동일. */}
        <nav className="flex flex-1 flex-col bg-white/5">
          {cols.map((col, ci) => {
            const isActive = MENU[ci].key === active;
            return (
              <div
                key={ci}
                className={`flex flex-1 flex-col justify-center gap-[10px] border-t-[0.3px] ${headerBorder} px-6 py-4`}
              >
                <Link
                  href={COL_HREFS[ci]}
                  onClick={selectMenu}
                  style={locale === "en" ? { fontFamily: "var(--font-montserrat)" } : undefined}
                  className={`w-fit text-[18px] font-extrabold leading-[1.3] tracking-[-0.36px] transition-colors ${
                    isActive ? "text-[#0ac200]" : light ? "text-[#231f20]" : "text-[#f0f0f0]"
                  }`}
                >
                  {col.h}
                </Link>
                <div className="flex flex-wrap gap-[10px]">
                  {col.links.map((l, li) => {
                    const href = COL_SUB_HREFS[ci]?.[li];
                    const cls = `text-[15px] leading-[1.3] tracking-[-0.3px] transition-colors hover:text-[#0ac200] ${
                      light ? "text-[#231f20]" : "text-white"
                    }`;
                    return href ? (
                      <Link key={li} href={href} onClick={(e) => handleSubLink(e, href)} className={cls}>
                        {l}
                      </Link>
                    ) : (
                      <span key={li} className={cls}>
                        {l}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* 아이콘 행 — 인스타 · 쇼핑몰 · 다국어 (PC 헤더와 동일) */}
        <div className={`flex items-center justify-center gap-6 border-t-[0.3px] ${headerBorder} bg-white/5 py-7`}>
          <a
            href="https://www.instagram.com/koreatnc1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.header.icons.instagram}
            onClick={closeMenu}
            className="transition-opacity hover:opacity-70"
          >
            <img src={`/intro/ic-instagram${sfx}.svg`} alt="" className="size-[26px]" />
          </a>
          <a
            href="https://smartstore.naver.com/koreatnc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.header.icons.store}
            onClick={closeMenu}
            className="transition-opacity hover:opacity-70"
          >
            <img src={`/intro/ic-store${sfx}.svg`} alt="" className="size-[26px]" />
          </a>
          {/* 지도(route) 아이콘 → 완보 인증 탭. 터치 기기라 툴팁 대신 aria-label 만 둔다. */}
          <Link
            href="/the-path-we-walk#certifications"
            aria-label={t.header.icons.certifications}
            onClick={(e) => handleSubLink(e, "/the-path-we-walk#certifications")}
            className="transition-opacity hover:opacity-70"
          >
            <img src={`/intro/ic-route${sfx}.svg`} alt="" className="size-[26px]" />
          </Link>
          {/* 구분선·글로브·KO/EN 모두 인스타/쇼핑 아이콘 색(#f0f0f0 dark / #9c9c9c light)에 맞춤 */}
          <span className="h-[25px] w-px" style={{ backgroundColor: light ? "#9c9c9c" : "#f0f0f0" }} />
          <button
            type="button"
            onClick={() => {
              toggle();
              closeMenu();
            }}
            aria-label={t.header.language}
            title={locale === "ko" ? "English" : "한국어"}
            className={`flex cursor-pointer items-center gap-1.5 transition-opacity hover:opacity-70 ${light ? "text-[#9c9c9c]" : "text-[#f0f0f0]"}`}
          >
            {/* 글로브 + KO/EN 모두 currentColor(=menuColor)라 테마에 같이 반응 */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden className="size-[26px]">
              <circle cx="12" cy="12" r="9" />
              <ellipse cx="12" cy="12" rx="3.6" ry="9" />
              <path d="M3 12h18" />
            </svg>
            <span className="text-[13px] font-extrabold" style={{ fontFamily: "var(--font-montserrat)" }}>
              {locale === "ko" ? "KO" : "EN"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

/** 우측 상단 아이콘 링크 — hover 시 아래에 설명 툴팁을 띄운다.
 *  헤더가 다크/라이트 두 테마를 오가므로 툴팁은 양쪽에서 읽히도록 짙은 배경 + 흰 글씨로 고정한다.
 *  CSS(group-hover)만 사용해 스크립트 없이 동작하고, aria-label 로 스크린리더에도 같은 설명을 준다. */
function IconLink({
  href,
  label,
  external,
  onClick,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  const tooltip = (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#231f20] px-2.5 py-1.5 text-[12px] font-semibold text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {label}
    </span>
  );
  const cls = "group relative flex items-center transition-opacity hover:opacity-70";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
      {children}
      {tooltip}
    </a>
  ) : (
    <Link href={href} onClick={onClick} aria-label={label} className={cls}>
      {children}
      {tooltip}
    </Link>
  );
}

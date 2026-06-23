"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

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
  const light = theme === "light";
  const sfx = light ? "-dark" : "";
  const menuColor = light ? "text-[#231f20]" : "text-white";
  const border = light ? "border-[#c6c6c6]" : "border-white/15";
  const headerBorder = light ? "border-[#c6c6c6]" : "border-white/20";
  const divider = light ? "bg-[#bdbdbd]" : "bg-white/40";

  return (
    <header
      className={`${fixed ? "fixed" : "absolute"} inset-x-0 top-0 z-50 border-b ${headerBorder} bg-white/[0.04] backdrop-blur-[2px] transition-colors duration-300`}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-[1920px] items-center lg:h-[80px] xl:h-[102px]">
        {/* 로고 (왼쪽 고정) → 인트로 */}
        <Link
          href="/"
          aria-label={t.header.home}
          className={`flex h-full shrink-0 items-center px-6 lg:w-[208px] lg:justify-center lg:border-r ${border} xl:w-[260px]`}
        >
          <img src={`/intro/logo${sfx}.svg`} alt="한국의길과문화" className="h-8 w-auto xl:h-10" />
        </Link>

        {/* 메뉴 (남는 폭을 균등하게 채움) */}
        <nav className="hidden h-full flex-1 items-stretch lg:flex">
          {MENU.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              // 영문 메뉴는 Figma 기준 Montserrat ExtraBold (한글은 기본 Pretendard)
              style={locale === "en" ? { fontFamily: "var(--font-montserrat)" } : undefined}
              className={`flex flex-1 items-center justify-center whitespace-nowrap border-r ${border} px-2 text-[14px] font-extrabold tracking-[-0.3px] transition-colors hover:text-[#0ac200] xl:text-[15px] ${
                item.key === active ? "text-[#0ac200]" : menuColor
              }`}
            >
              {t.header.nav[item.key]}
            </Link>
          ))}
        </nav>

        {/* 아이콘 (오른쪽 고정) */}
        <div className="flex shrink-0 items-center gap-5 px-6 xl:gap-[30px] xl:px-[50px]">
          <a
            href="https://www.instagram.com/koreatnc1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-opacity hover:opacity-70"
          >
            <img src={`/intro/ic-instagram${sfx}.svg`} alt="" className="size-[26px] xl:size-[30px]" />
          </a>
          <a
            href="https://smartstore.naver.com/koreatnc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Store"
            className="transition-opacity hover:opacity-70"
          >
            <img src={`/intro/ic-store${sfx}.svg`} alt="" className="size-[26px] xl:size-[30px]" />
          </a>
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
  );
}

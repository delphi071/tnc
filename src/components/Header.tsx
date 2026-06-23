/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

/** 상단 GNB — Figma "00. main" 헤더 (모든 화면 공통).
 *  active: 현재 섹션 메뉴를 초록색으로 강조
 *  theme: "light" → 밝은 배경용 (어두운 로고/아이콘, 검정 메뉴, 회색 외곽선) */
const MENU = [
  { label: "우리의 길", href: "/our-way" },
  { label: "같은 길, 다른 시선", href: "/same-trail" },
  { label: "우리가 걷는 길", href: "/the-path-we-walk" },
  { label: "함께 걷는 사람들", href: "#" },
  { label: "알리는 이야기", href: "#" },
  { label: "마음잇기", href: "#" },
];

export default function Header({
  active,
  fixed,
  theme = "dark",
}: {
  active?: string;
  fixed?: boolean;
  theme?: "dark" | "light";
}) {
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
          aria-label="한국의길과문화 홈"
          className={`flex h-full shrink-0 items-center px-6 lg:w-[208px] lg:justify-center lg:border-r ${border} xl:w-[260px]`}
        >
          <img src={`/intro/logo${sfx}.svg`} alt="한국의길과문화" className="h-8 w-auto xl:h-10" />
        </Link>

        {/* 메뉴 (남는 폭을 균등하게 채움) */}
        <nav className="hidden h-full flex-1 items-stretch lg:flex">
          {MENU.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-1 items-center justify-center whitespace-nowrap border-r ${border} px-2 text-[14px] font-extrabold tracking-[-0.3px] transition-colors hover:text-[#0ac200] xl:text-[15px] ${
                item.label === active ? "text-[#0ac200]" : menuColor
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 아이콘 (오른쪽 고정) */}
        <div className="flex shrink-0 items-center gap-5 px-6 xl:gap-[30px] xl:px-[50px]">
          <a href="#" aria-label="Instagram" className="transition-opacity hover:opacity-70">
            <img src={`/intro/ic-instagram${sfx}.svg`} alt="" className="size-[26px] xl:size-[30px]" />
          </a>
          <a href="#" aria-label="Store" className="transition-opacity hover:opacity-70">
            <img src={`/intro/ic-store${sfx}.svg`} alt="" className="size-[26px] xl:size-[30px]" />
          </a>
          <span className={`h-[25px] w-px ${divider}`} />
          <a href="#" aria-label="Language" className="transition-opacity hover:opacity-70">
            <img src={`/intro/ic-language${sfx}.svg`} alt="" className="size-[26px] xl:size-[30px]" />
          </a>
        </div>
      </div>
    </header>
  );
}

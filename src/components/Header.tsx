/* eslint-disable @next/next/no-img-element */

/** 상단 GNB — Figma "00. main" 헤더 (모든 인트로 공통, 화면 폭 전체 / 내부 콘텐츠는 max 1920) */
const MENU = [
  "우리의 길",
  "같은 길, 다른 시선",
  "우리가 걷는 길",
  "함께 걷는 사람들",
  "알리는 이야기",
  "마음잇기",
];

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-white/[0.04] backdrop-blur-[2px]">
      <div className="mx-auto flex h-[68px] w-full max-w-[1920px] items-center border-b border-white/20 lg:h-[80px] xl:h-[102px]">
        {/* 로고 */}
        <div className="flex h-full shrink-0 items-center px-6 lg:w-[208px] lg:justify-center lg:border-r lg:border-white/15 xl:w-[260px]">
          <img
            src="/intro/logo.svg"
            alt="한국의길과문화"
            className="h-8 w-auto xl:h-10"
          />
        </div>

        {/* 메뉴 */}
        <nav className="hidden h-full items-stretch lg:flex">
          {MENU.map((item) => (
            <a
              key={item}
              href="#"
              className="flex items-center justify-center whitespace-nowrap border-r border-white/15 px-5 text-[14px] text-white transition-colors hover:text-[#0ac200] xl:px-7 xl:text-[15px]"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* 아이콘 */}
        <div className="ml-auto flex items-center gap-5 px-6 xl:gap-[30px] xl:px-[50px]">
          <a href="#" aria-label="Instagram" className="transition-opacity hover:opacity-70">
            <img src="/intro/ic-instagram.svg" alt="" className="size-[26px] xl:size-[30px]" />
          </a>
          <a href="#" aria-label="Store" className="transition-opacity hover:opacity-70">
            <img src="/intro/ic-store.svg" alt="" className="size-[26px] xl:size-[30px]" />
          </a>
          <span className="h-[25px] w-px bg-white/40" />
          <a href="#" aria-label="Language" className="transition-opacity hover:opacity-70">
            <img src="/intro/ic-language.svg" alt="" className="size-[26px] xl:size-[30px]" />
          </a>
        </div>
      </div>
    </header>
  );
}

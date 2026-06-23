"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** "04. 함께 걷는 사람들 contents" — 단체 카드 (로고 + 제목 + 설명 + 자세히 보기 버튼).
 *  1920 스테이지 중앙에 배치 (스케일 스테이지 안에서 사용). 버튼은 새 창 외부 링크. */
export type OrgCard = {
  logo: string;
  /** 로고 박스 가로폭(px, 세로 240 고정) */
  logoW: number;
  title: string;
  lines: string[];
  href: string;
};

export default function OrgCardSection({ logo, logoW, title, lines, href }: OrgCard) {
  // 영문 설명은 단락 통째라 폭 안에서 자동 줄바꿈, 한국어는 사전 줄나눔(nowrap) 유지
  const en = useLocale().locale === "en";
  const learnMore = useT().walkingTogether.learnMore;
  return (
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-start gap-[80px]">
      <div className="relative shrink-0" style={{ width: logoW, height: 240 }}>
        <Image src={logo} alt="" fill sizes="332px" className="object-contain" />
      </div>
      <div className="flex flex-col items-start gap-[52px]">
        <div className="flex flex-col items-start gap-8">
          <p className="font-bold text-black" style={{ fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.832px" }}>
            {title}
          </p>
          <div className={en ? "" : "whitespace-nowrap"} style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.18px", color: "#5a5b5d", width: en ? 720 : undefined }}>
            {lines.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[50px] w-[182px] items-center justify-center rounded-br-[20px] rounded-tl-[20px] bg-[#0ac200] transition-opacity hover:opacity-90"
        >
          <span className="font-bold text-black" style={{ fontSize: 14, lineHeight: 1.5 }}>
            {learnMore}
          </span>
        </a>
      </div>
    </div>
  );
}

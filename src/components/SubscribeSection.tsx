"use client";

import Image from "next/image";
import { useState } from "react";

/** "05. 알리는 이야기 > 소식받기" 탭 패널 — 소식 신청 폼 + 안내 카드 3개.
 *  NoticesSection 탭에서 활성화 시 렌더. 정적 폼(실제 전송 로직 없음). */

const INTERESTS = ["둘레길지킴이", "자원봉사", "걷기문화 프로그램"] as const;
const EMAIL_DOMAINS = ["gmail.com", "naver.com", "daum.net", "kakao.com", "직접 입력"];

/** 하단 안내 카드 (피그마 순서) */
const CARDS = [
  {
    img: "/intro/os-sub-1.jpg",
    title: "둘레길지킴이",
    lines: [
      "유니크 로컬 체험 ‘길문화학교’, 청소년 멘토링",
      "걷기여행 ‘청소년여행문화학교’ 등 걷기여행을",
      "운영하고 있습니다.",
      "개인은 물론 단체/기업 참여가 가능합니다.",
    ],
  },
  {
    img: "/intro/os-sub-2.jpg",
    title: "자원봉사",
    lines: [
      "걷기길 관리/운영 봉사활동을 하고 있습니다.",
      "제초, 정비, 플로깅(환경보호) 등",
      "우리의 길을 지키기 위한 다양한 활동을",
      "비정기적 운영하고 있습니다.",
    ],
  },
  {
    img: "/intro/os-sub-3.jpg",
    title: "걷기문화 프로그램",
    lines: [
      "매년 모집/선발된 둘레길 지킴이 선생님들이",
      "편안하고 안전한 둘레길 여행을 위해",
      "각 지역/구간을 정기적 관리하고 있습니다.",
    ],
  },
];

/** 필수 표시 점 */
function Req() {
  return <span className="ml-1 inline-block size-[5px] shrink-0 rounded-full bg-[#0ac200] align-top" />;
}

/** 라벨(20px Bold) + 필드 한 줄. 라벨 폭 고정, 모바일에서는 세로 스택 */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
      <p className="flex w-[220px] shrink-0 items-start font-bold text-black" style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: "-0.2px" }}>
        {label}
        <Req />
      </p>
      <div className="flex-1">{children}</div>
    </div>
  );
}

const underline = "border-0 border-b border-[#9c9c9c] bg-transparent pb-2 text-[20px] text-black outline-none placeholder:text-[#c5c5c5] focus:border-[#0ac200]";

export default function SubscribeSection() {
  const [interest, setInterest] = useState<string>("");
  const [agree, setAgree] = useState(false);

  return (
    <div className="flex flex-col px-[50px]">
      {/* 헤딩 */}
      <div className="font-bold text-black" style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.624px" }}>
        <p>한국과길과문화의</p>
        <p>새로운 소식을 보내드려요.</p>
      </div>

      {/* 폼 */}
      <form
        className="mt-[100px] flex flex-col gap-[60px]"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* 성함 */}
        <Field label="소식 받는 분 성함">
          <input type="text" className={`${underline} w-full max-w-[320px]`} placeholder="홍길동" />
        </Field>

        {/* 연락처 */}
        <Field label="소식 받는 분 연락처">
          <div className="flex items-end gap-[18px]" style={{ fontSize: 20 }}>
            <span className="pb-2 text-black">010</span>
            <span className="pb-2 text-black">-</span>
            <input type="tel" inputMode="numeric" maxLength={4} className={`${underline} w-[120px] text-center`} placeholder="0000" />
            <span className="pb-2 text-black">-</span>
            <input type="tel" inputMode="numeric" maxLength={4} className={`${underline} w-[120px] text-center`} placeholder="0000" />
          </div>
        </Field>

        {/* 이메일 */}
        <Field label="소식 받을 이메일">
          <div className="flex flex-wrap items-end gap-[14px]" style={{ fontSize: 20 }}>
            <input type="text" className={`${underline} w-[240px]`} placeholder="이메일" />
            <span className="pb-2 text-black" style={{ fontFamily: "var(--font-montserrat)" }}>@</span>
            <div className="relative">
              <select className={`${underline} w-[180px] cursor-pointer appearance-none pr-6`} style={{ fontFamily: "var(--font-montserrat)" }} defaultValue="gmail.com">
                {EMAIL_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute bottom-3 right-1" width="11" height="6" viewBox="0 0 11 6" fill="none">
                <path d="M1 1l4.5 4L10 1" stroke="#231f20" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Field>

        {/* 관심분야 */}
        <Field label="관심분야">
          <div className="flex flex-wrap gap-[19px]">
            {INTERESTS.map((v) => {
              const on = interest === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setInterest(v)}
                  className={`flex h-[52px] w-[232px] cursor-pointer items-center justify-center rounded-full font-bold transition-colors ${
                    on ? "bg-[#0ac200] text-black" : "bg-white text-black hover:bg-[#e9e9e9]"
                  }`}
                  style={{ fontSize: 16, letterSpacing: "-0.16px" }}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </Field>

        {/* 구분선 */}
        <div className="h-px w-full bg-[#c6c6c6]" />

        {/* 동의 + 신청 */}
        <div className="flex flex-wrap items-center justify-end gap-[40px]">
          <button
            type="button"
            onClick={() => setAgree((v) => !v)}
            className="flex cursor-pointer items-center gap-[16px]"
          >
            <span
              className={`flex size-[24px] items-center justify-center rounded-[4px] border ${
                agree ? "border-[#0ac200] bg-[#0ac200]" : "border-[#9c9c9c] bg-white"
              }`}
            >
              {agree && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5 9-9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-black" style={{ fontSize: 16, letterSpacing: "-0.16px" }}>
              개인정보 수집 및 활용에 동의합니다.
            </span>
          </button>
          <button
            type="submit"
            disabled={!agree}
            className="flex h-[60px] w-[256px] cursor-pointer items-center justify-center rounded-br-[20px] rounded-tl-[20px] bg-[#0ac200] font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ fontSize: 16, letterSpacing: "-0.8px" }}
          >
            신청
          </button>
        </div>
      </form>

      {/* 안내 카드 3개 */}
      <div className="mt-[160px] grid grid-cols-1 gap-x-[80px] gap-y-[60px] md:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.title} className="flex flex-col items-center gap-[30px]">
            <div className="relative size-[320px] overflow-hidden rounded-br-[40px] rounded-tl-[40px] bg-[#d9d9d9]">
              <Image src={c.img} alt={c.title} fill sizes="320px" className="object-cover" />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-extrabold text-black" style={{ fontSize: 20, lineHeight: 1.1, letterSpacing: "-0.2px" }}>
                {c.title}
              </p>
              <div style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.18px", color: "#5a5b5d" }}>
                {c.lines.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

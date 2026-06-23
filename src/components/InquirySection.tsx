"use client";

import { useT } from "@/i18n/useT";

/** "05. 알리는 이야기 > 문의하기" 탭 패널 — 성함 / 이메일 / 문의내용 + 보내기 (텍스트는 사전).
 *  NoticesSection 탭에서 활성화 시 렌더. 정적 폼(실제 전송 로직 없음). */

const FIXED_DOMAINS = ["gmail.com", "naver.com", "daum.net", "kakao.com"];

/** 필수 표시 점 */
function Req() {
  return <span className="ml-1 inline-block size-[5px] shrink-0 rounded-full bg-[#0ac200] align-top" />;
}

/** 라벨(20px Bold) + 필드 한 줄. 모바일에서는 세로 스택 */
function Field({ label, align = "center", children }: { label: string; align?: "center" | "start"; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-3 md:flex-row md:gap-6 ${align === "center" ? "md:items-center" : "md:items-start"}`}>
      <p className={`flex w-[200px] shrink-0 items-start font-bold text-black ${align === "start" ? "md:pt-3" : ""}`} style={{ fontSize: 20, lineHeight: 1.3, letterSpacing: "-0.2px" }}>
        {label}
        <Req />
      </p>
      <div className="flex-1">{children}</div>
    </div>
  );
}

const underline = "border-0 border-b border-[#9c9c9c] bg-transparent pb-2 text-[20px] text-black outline-none placeholder:text-[#c5c5c5] focus:border-[#0ac200]";

export default function InquirySection() {
  const t = useT().inquiry;
  const emailDomains = [...FIXED_DOMAINS, t.emailDirect];
  return (
    <div className="flex flex-col px-[50px]">
      {/* 헤딩 */}
      <div className="font-bold text-black" style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.624px" }}>
        {t.heading.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* 폼 */}
      <form className="mt-[100px] flex flex-col gap-[60px]" onSubmit={(e) => e.preventDefault()}>
        {/* 성함 */}
        <Field label={t.labels.name}>
          <input type="text" className={`${underline} w-full max-w-[490px]`} placeholder={t.namePlaceholder} />
        </Field>

        {/* 이메일 */}
        <Field label={t.labels.email}>
          <div className="flex flex-wrap items-end gap-[14px]" style={{ fontSize: 20 }}>
            <input type="text" className={`${underline} w-[240px]`} placeholder={t.emailPlaceholder} />
            <span className="pb-2 text-black" style={{ fontFamily: "var(--font-montserrat)" }}>@</span>
            <div className="relative">
              <select className={`${underline} w-[180px] cursor-pointer appearance-none pr-6`} style={{ fontFamily: "var(--font-montserrat)" }} defaultValue="gmail.com">
                {emailDomains.map((d) => (
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

        {/* 문의내용 */}
        <Field label={t.labels.content} align="start">
          <textarea
            rows={6}
            className="w-full resize-y border border-[#464444] bg-transparent p-[14px] text-[20px] leading-[1.5] text-black outline-none placeholder:text-[#bdbdbd] focus:border-[#0ac200]"
            style={{ minHeight: 198 }}
            placeholder={t.contentPlaceholder}
          />
        </Field>

        {/* 구분선 */}
        <div className="h-px w-full bg-[#c6c6c6]" />

        {/* 보내기 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex h-[50px] w-[200px] cursor-pointer items-center justify-center rounded-br-[20px] rounded-tl-[20px] bg-[#0ac200] font-bold text-black transition-opacity hover:opacity-90"
            style={{ fontSize: 16, letterSpacing: "-0.8px" }}
          >
            {t.submit}
          </button>
        </div>
      </form>
    </div>
  );
}

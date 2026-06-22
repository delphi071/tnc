/* eslint-disable @next/next/no-img-element */

/** Figma footer (1920×519, #231f20). 약도 다음 일반 스크롤로 등장. */
const STAGE_W = 1920;
export const FOOTER_H = 519;

const COLS = [
  { h: "우리의 길", links: ["설립목적", "비전 및 핵심가치", "주요 연혁", "사람들", "오시는 길"] },
  { h: "같은 길, 다른 시선", links: ["전문역량"] },
  { h: "우리가 걷는 길", links: ["코리아둘레길", "지역길 조사 및 계획", "걷기 문화 프로그램", "굿즈 개발 및 판매"] },
  { h: "함께 걷는 사람들", links: ["한국걷는길연합", "ATN", "WTN", "코리아둘레길 완보자 클럽"] },
  { h: "알리는 이야기", links: ["공지사항", "소식받기", "문의하기"] },
  { h: "마음잇기", links: ["후원하기", "연간기금 및 활동 실적내역"] },
];

export default function SiteFooter({ scale }: { scale: number }) {
  return (
    <footer className="relative w-full overflow-hidden bg-[#231f20]" style={{ height: FOOTER_H * scale }}>
      <div className="absolute left-1/2 top-0" style={{ width: STAGE_W, height: FOOTER_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}>
        {/* 상단: 로고 + 링크 6컬럼 */}
        <div className="absolute left-0 top-0 flex w-full items-stretch" style={{ height: 293 }}>
          <div className="flex w-[557px] shrink-0 flex-col items-end justify-center gap-5 border-b px-20" style={{ borderColor: "#5a5b5d" }}>
            <img src="/intro/footer-bt.svg" alt="Beyond the Route" style={{ width: 191, height: 101.7 }} />
            <p className="text-right font-semibold" style={{ fontSize: 12, color: "#c6c6c6", fontFamily: "var(--font-montserrat)" }}>
              Korean Trails and Culture Foundation
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.h} className="flex flex-1 flex-col gap-5 border-b border-l px-5 pb-5 pt-[60px]" style={{ borderColor: "#5a5b5d" }}>
              <p className="font-extrabold" style={{ fontSize: 18, color: "#9c9c9c", lineHeight: 1.3, letterSpacing: "-0.36px" }}>{c.h}</p>
              <div className="flex flex-col gap-3">
                {c.links.map((l) => (
                  <p key={l} style={{ fontSize: 18, color: "#737373", lineHeight: 1.4, letterSpacing: "-0.9px", whiteSpace: "nowrap" }}>{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단: 로고 + 정보 + 소셜 */}
        <div className="absolute flex items-center gap-[77px]" style={{ left: 335, top: 368, width: 1357 }}>
          <img src="/intro/logo.svg" alt="한국의길과문화" className="shrink-0" style={{ width: 143, height: 60 }} />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex flex-col gap-2" style={{ fontSize: 14, color: "#737373" }}>
              <p>대표 : 홍성운&nbsp;&nbsp;|&nbsp;&nbsp;사업자등록번호 : 123-82-14123</p>
              <p>주소 : 서울특별시 용산구 한강대로52길 25-8, DB Tower 402호&nbsp;&nbsp;|&nbsp;&nbsp;대표전화 : 02-6013-6610&nbsp;&nbsp;|&nbsp;&nbsp;이메일 : ktnc@tnc.or.kr</p>
              <p>개인정보보호책임자 : 최해선</p>
            </div>
            <div className="flex shrink-0 items-center gap-[30px]">
              <img src="/intro/ic-instagram.svg" alt="" style={{ width: 24, height: 24 }} />
              <img src="/intro/ic-store.svg" alt="" style={{ width: 24, height: 24 }} />
              <span style={{ width: 1, height: 20, backgroundColor: "#9c9c9c" }} />
              <img src="/intro/ic-language.svg" alt="" style={{ width: 24, height: 24 }} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

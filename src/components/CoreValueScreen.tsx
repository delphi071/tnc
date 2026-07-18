"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** Figma "01. 우리의 길 > Core Value" (node 1712:9509, 밝은 배경).
 *  4개 값이 2×2 그리드로 한 화면에 모두 보인다 (아이콘 위 / 텍스트 아래, 가운데 정렬).
 *
 *  Figma 는 세로로 펼쳐지는 시안이라 원본 세로 수치(아이콘 200 / 아이콘갭 100 / 행간격 300)를
 *  그대로 쓰면 약 1220px 로 1080 스테이지를 넘긴다. 가로 수치(셀 600 / 텍스트 430)와 타이포는
 *  Figma 그대로 두고, 세로만 한 화면에 들어오도록 압축했다. */
const STAGE_W = 1920;
const STAGE_H = 1080;

/** 세로 수치는 "짧은 뷰포트에서도 헤더에 안 가리고 한 화면에 다 보이는 것"이 제약이다.
 *  스테이지(1080)는 뷰포트 세로 중앙에 놓이므로, 뷰포트가 1080보다 짧으면 위아래가 잘린다.
 *  블록 총높이 H 일 때 상단 여백 = (뷰포트 - H)/2 이고, 이게 헤더(최대 102px)보다 커야 한다.
 *  → 뷰포트 940 기준 H ≤ 730 이어야 안전. 아래 수치는 그 예산에 맞춘 것. */
const ICON = 120; // Figma 200
const ICON_GAP = 24; // Figma 100
const ROW_GAP = 32; // Figma 300
const HEAD_GAP = 40; // 제목 → 그리드 (Figma 211)
const CELL_W = 600; // Figma 그대로
const TEXT_W = 430; // Figma 그대로

const ICONS = ["discovery", "connection", "sustainability", "trust"];

export default function CoreValueScreen({ scale }: { scale: number }) {
  const values = useT().ourWay.coreValue;
  const { locale } = useLocale();
  const en = locale === "en";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#f0f0f0]">
      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {/* 제목 + 2×2 그리드를 하나의 블록으로 묶어 스테이지 세로 중앙에 배치.
            절대 top 을 쓰면 짧은 뷰포트에서 제목이 헤더 뒤로 들어가므로 중앙 정렬로 둔다. */}
        <div
          className="absolute left-1/2 top-1/2 flex flex-col items-center"
          style={{ gap: HEAD_GAP, transform: "translate(-50%, -50%)" }}
        >
          <p
            className="text-center font-bold text-[#0ac200]"
            style={{ fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}
          >
            Core Value
          </p>

          {/* 값 2×2 그리드 (4개 모두 한 화면에 노출) */}
          <div
            className="grid grid-cols-2"
            style={{ width: CELL_W * 2, columnGap: 0, rowGap: ROW_GAP }}
          >
            {ICONS.map((icon, k) => {
              const v = values[k];
              return (
                <div
                  key={icon}
                  className="flex flex-col items-center"
                  style={{ width: CELL_W, gap: ICON_GAP }}
                >
                  <img
                    src={`/our-way/${icon}.gif`}
                    alt=""
                    className="shrink-0 object-contain"
                    style={{ width: ICON, height: ICON }}
                  />
                  <div className="flex flex-col items-center gap-[18px] text-center" style={{ width: TEXT_W }}>
                    <div className="flex flex-col items-center gap-[6px]">
                      {v.eyebrow && (
                        <p
                          className="font-semibold text-[#0ac200]"
                          style={{ fontFamily: "var(--font-montserrat)", fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.18px" }}
                        >
                          {v.eyebrow}
                        </p>
                      )}
                      <p
                        className="font-bold text-black"
                        style={{ fontSize: 32, lineHeight: 1.3, letterSpacing: "-0.832px", fontFamily: en ? "var(--font-montserrat)" : undefined }}
                      >
                        {v.title}
                      </p>
                      <p className="text-[#5a5b5d]" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.36px" }}>
                        {v.sub}
                      </p>
                    </div>
                    <p className="text-black" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.36px" }}>
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

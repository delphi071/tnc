"use client";

import { useT } from "@/i18n/useT";

/** Figma "01. 우리의 길 contents0 > Mission" (1920×1080) */
const STAGE_W = 1920;
const STAGE_H = 1080;
const CIRCLE = 275; // 245 → 약간 키움 (특히 02 텍스트 여유 확보)
const CIRCLE_CY = 737.5; // 원 세로 중심 (디자인 기준 유지)

/** 원 3개 지오메트리 (텍스트는 사전 mission.circles[i]) */
const CIRCLES = [
  { cx: 560.5, n: "01" },
  { cx: 959.5, n: "02" },
  { cx: 1358.5, n: "03" },
];

/** 원 사이 "+" 커넥터 중심 x */
const PLUS_X = [760, 1159];

export default function MissionScreen({ scale }: { scale: number }) {
  const m = useT().ourWay.mission;
  return (
    // 배경 이미지 없이(히어로 배경이 고정으로 비침) 어두운 레이어 + 콘텐츠만 올라옴
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/65" />

      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {/* Mission 라벨 */}
        <p
          className="absolute text-center font-bold text-[#0ac200]"
          style={{ left: 0, right: 0, top: 212, fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}
        >
          Mission
        </p>

        {/* 헤드라인 — 각 줄을 강제로 한 줄 유지(영문이 길어도 줄깨짐 방지) */}
        <div
          className="absolute whitespace-nowrap text-center font-bold text-white"
          style={{ left: 0, right: 0, top: 333, fontSize: 40, lineHeight: 1.2, letterSpacing: "-0.4px" }}
        >
          {m.headline.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* 설명 — 상단 정렬(아래로 늘어나며, 영문 다줄에도 헤드라인과 겹치지 않게) */}
        <div
          className="absolute text-center text-white/90"
          style={{ left: 0, right: 0, top: 456, fontSize: 18, lineHeight: 1.45, letterSpacing: "-0.36px" }}
        >
          {m.desc.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* 원 3개 */}
        {CIRCLES.map((c) => (
          <div
            key={c.n}
            className="absolute rounded-full bg-[#0ac200]"
            style={{ left: c.cx - CIRCLE / 2, top: CIRCLE_CY - CIRCLE / 2, width: CIRCLE, height: CIRCLE, boxShadow: "0 0 60px rgba(10,194,0,0.35)" }}
          />
        ))}

        {/* 원 안 텍스트 (원 중심 정렬) */}
        {CIRCLES.map((c, ci) => (
          <div
            key={`t-${c.n}`}
            className="absolute flex -translate-x-1/2 flex-col items-center gap-3 text-center text-black"
            style={{ left: c.cx, top: 676 }}
          >
            <p className="font-bold" style={{ fontSize: 24, lineHeight: 1, fontFamily: "var(--font-montserrat)" }}>
              {c.n}
            </p>
            <div style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.9px" }}>
              {m.circles[ci].map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          </div>
        ))}

        {/* "+" 커넥터 */}
        {PLUS_X.map((cx) => (
          <div key={cx} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: cx, top: 745, width: 50, height: 50 }}>
            <div className="absolute left-1/2 -translate-x-1/2 bg-[#d9d9d9] opacity-50" style={{ top: 0, width: 5, height: 50 }} />
            <div className="absolute top-1/2 -translate-y-1/2 bg-[#d9d9d9] opacity-50" style={{ left: 0, width: 50, height: 5 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

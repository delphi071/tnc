/* eslint-disable @next/next/no-img-element */

import type { RefObject } from "react";

/** Figma "01. 우리의 길 > Core Value" (밝은 배경, 1920×1080).
 *  값 블록(아이콘+텍스트)이 3D 큐브로 회전하며 4개 값이 차례로 노출됨. */
const STAGE_W = 1920;
const STAGE_H = 1080;

/** 큐브 깊이 = 면 높이/2 (OurWayHero 의 회전 transform 과 공유) */
export const CV_DEPTH = 110;
const FACE_W = 730;
const FACE_H = 220;

const VALUES = [
  {
    icon: "cv-discovery",
    en: "Discovery",
    ko: "발견",
    sub: "모든 길에는 이야기가 흐른다",
    desc: "길 위의 숨은 역사와 문화를 찾아 매력적인 콘텐츠로 만듭니다.",
  },
  {
    icon: "cv-connection",
    en: "Connection",
    ko: "연결",
    sub: "길은 사람과 지역을 잇는 다리다",
    desc: "지역과 사람, 자연과 여행자를 따뜻한 유대감으로 잇습니다.",
  },
  {
    icon: "cv-sustainability",
    en: "Sustainability",
    ko: "지속",
    sub: "오늘의 길이 내일에도 이어지도록",
    desc: "자연 생태계를 보전하고 지역 경제를 살려 내일의 길을 지켜나갑니다.",
  },
  {
    icon: "cv-trust",
    en: "Trust",
    ko: "신뢰",
    sub: "안심하고 걷는 길, 믿음으로 쌓는 문화",
    desc: "누구나 믿고 걸을 수 있도록 체계적인 관리와 운영의 전문성을 갖춥니다.",
  },
];

export default function CoreValueScreen({
  scale,
  cubeRef,
}: {
  scale: number;
  cubeRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#f0f0f0]">
      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {/* 섹션 제목 (고정) */}
        <p
          className="absolute text-center font-bold text-[#0ac200]"
          style={{ left: 0, right: 0, top: 270, fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}
        >
          Core Value
        </p>

        {/* 값 큐브 (스크롤 시 위로 회전) */}
        <div
          className="absolute left-1/2"
          style={{ top: 610, width: FACE_W, height: FACE_H, transform: "translate(-50%, -50%)", perspective: 2000 }}
        >
          <div
            ref={cubeRef}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              transform: `translateZ(-${CV_DEPTH}px) rotateX(0deg)`,
            }}
          >
            {VALUES.map((v, k) => (
              <div
                key={v.en}
                className="absolute inset-0 flex items-center gap-[100px]"
                style={{ transform: `rotateX(${-90 * k}deg) translateZ(${CV_DEPTH}px)`, backfaceVisibility: "hidden" }}
              >
                <img src={`/intro/${v.icon}.svg`} alt="" className="shrink-0" style={{ width: 200, height: 200 }} />
                <div className="flex w-[430px] flex-col gap-6 whitespace-nowrap">
                  <div className="flex flex-col gap-3">
                    <p
                      className="font-semibold text-[#0ac200]"
                      style={{ fontFamily: "var(--font-montserrat)", fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.18px" }}
                    >
                      {v.en}
                    </p>
                    <div className="flex items-center gap-[14px]">
                      <p className="font-bold text-black" style={{ fontSize: 32, lineHeight: 1.3, letterSpacing: "-0.832px" }}>
                        {v.ko}
                      </p>
                      <p className="text-[#5a5b5d]" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.36px" }}>
                        {v.sub}
                      </p>
                    </div>
                  </div>
                  <p className="text-black" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.36px" }}>
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

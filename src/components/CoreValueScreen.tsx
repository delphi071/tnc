"use client";

/* eslint-disable @next/next/no-img-element */

import type { RefObject } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** Figma "01. 우리의 길 > Core Value" (밝은 배경, 1920×1080).
 *  값 블록(아이콘+텍스트)이 3D 큐브로 회전하며 4개 값이 차례로 노출됨. */
const STAGE_W = 1920;
const STAGE_H = 1080;

/** 큐브 깊이 = 면 높이/2 (OurWayHero 의 회전 transform 과 공유) */
export const CV_DEPTH = 110;
const FACE_W = 730;
const FACE_H = 220;

/** 아이콘 순서 (텍스트는 사전 coreValue[i]) */
const ICONS = ["cv-discovery", "cv-connection", "cv-sustainability", "cv-trust"];

export default function CoreValueScreen({
  scale,
  cubeRef,
}: {
  scale: number;
  cubeRef?: RefObject<HTMLDivElement | null>;
}) {
  const values = useT().ourWay.coreValue;
  const { locale } = useLocale();
  const en = locale === "en";
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
            {ICONS.map((icon, k) => {
              const v = values[k];
              return (
                <div
                  key={icon}
                  className="absolute inset-0 flex items-center gap-[100px]"
                  style={{ transform: `rotateX(${-90 * k}deg) translateZ(${CV_DEPTH}px)`, backfaceVisibility: "hidden" }}
                >
                  <img src={`/intro/${icon}.svg`} alt="" className="shrink-0" style={{ width: 200, height: 200 }} />
                  {/* 영문은 eyebrow 없이 영문 제목 + 인라인 sub(한 줄), 설명은 2줄로 줄바꿈 (Figma 기준) */}
                  <div className="flex flex-col gap-6" style={{ width: en ? 660 : 430, whiteSpace: en ? "normal" : "nowrap" }}>
                    <div className="flex flex-col gap-3">
                      {v.eyebrow && (
                        <p
                          className="font-semibold text-[#0ac200]"
                          style={{ fontFamily: "var(--font-montserrat)", fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.18px" }}
                        >
                          {v.eyebrow}
                        </p>
                      )}
                      <div className="flex items-baseline gap-[14px] whitespace-nowrap">
                        <p
                          className="shrink-0 font-bold text-black"
                          style={{ fontSize: 32, lineHeight: 1.3, letterSpacing: "-0.832px", fontFamily: en ? "var(--font-montserrat)" : undefined }}
                        >
                          {v.title}
                        </p>
                        <p className="text-[#5a5b5d]" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.36px" }}>
                          {v.sub}
                        </p>
                      </div>
                    </div>
                    <p className="text-black" style={{ fontSize: 18, lineHeight: 1.3, letterSpacing: "-0.36px", whiteSpace: en ? "pre-line" : undefined }}>
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

"use client";

import Image from "next/image";
import { useT } from "@/i18n/useT";

/** Figma "01. 우리의 길 contents > Vision" (1920×1080) — 헤더는 페이지 고정 헤더 사용 */
const STAGE_W = 1920;
const STAGE_H = 1080;

export default function VisionScreen({ scale }: { scale: number }) {
  const headline = useT().ourWay.vision.headline;
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <Image src="/intro/bg-vision.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {/* Vision 라벨 */}
        <p
          className="absolute text-center font-bold text-[#0ac200]"
          style={{ left: 0, right: 0, top: 250, fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}
        >
          Vision
        </p>

        {/* 헤드라인 */}
        <div
          className="absolute text-center font-bold text-white"
          style={{ left: 0, right: 0, top: 468, fontSize: 40, lineHeight: 1.5, letterSpacing: "-0.8px" }}
        >
          {headline.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

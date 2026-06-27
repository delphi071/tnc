"use client";

/* eslint-disable @next/next/no-img-element */

import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** Figma "01. 우리의 길 > Location(약도)". peel 로 드러남.
 *  고정 헤더(약 102px)를 비워두고, 남은 공간에 약도가 모두 보이도록 반응형 배치.
 *  약도 라벨은 한/영 다르므로 locale 별 이미지(map-ko/map-en) 사용. */

export default function MapScreen() {
  const loc = useT().ourWay.location;
  const mapSrc = useLocale().locale === "en" ? "/intro/map-en.png" : "/intro/map-ko.png";
  return (
    <section
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f0f0f0] px-10 pb-12"
      style={{ paddingTop: 130 }}
    >
      <p className="font-bold text-[#0ac200]" style={{ fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}>
        Location
      </p>
      <p className="mt-5 font-bold text-black" style={{ fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.32px" }}>
        {loc.subtitle}
      </p>

      <div className="mt-12 flex w-full max-w-[1160px] items-center justify-between gap-12">
        <img
          src={mapSrc}
          alt="오시는 길 약도"
          className="h-auto w-auto shrink"
          style={{ maxHeight: "50vh", maxWidth: "58%" }}
        />
        <div className="flex shrink-0 flex-col gap-4">
          {loc.info.map((t) => (
            <div key={t} className="flex items-center gap-3">
              <span className="shrink-0 rounded-full border" style={{ width: 24, height: 24, borderColor: "#0ac200" }} />
              <span style={{ fontSize: 18, color: "#5a5b5d", letterSpacing: "-0.36px" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

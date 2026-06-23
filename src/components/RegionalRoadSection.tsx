"use client";

import { useT } from "@/i18n/useT";
import TabCarousel, { type CarouselSlide } from "./TabCarousel";

/** "03. 우리가 걷는 길 contents-2. 지역길 조사 및 연구" — 탭 2개 가로 캐러셀 (텍스트는 사전) */
const IMGS = [
  { src: "/intro/rr-1.jpg" },
  { src: "/intro/rr-2.jpg", imgPos: "object-bottom" },
];

export default function RegionalRoadSection() {
  const t = useT().thePathWeWalk;
  const slides: CarouselSlide[] = t.regional.tabs.map((tab, i) => ({
    tab: tab.name,
    img: IMGS[i].src,
    imgPos: IMGS[i].imgPos,
    blocks: tab.blocks,
  }));
  return <TabCarousel label={t.sectionLabel} title={t.regional.title} slides={slides} />;
}

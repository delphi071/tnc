"use client";

import { useT } from "@/i18n/useT";
import TabCarousel, { type CarouselSlide } from "./TabCarousel";

/** "03. 우리가 걷는 길 contents-4. 굿즈 기획 및 판매" — 탭 3개 가로 캐러셀 (텍스트는 사전) */
const IMGS = [
  { src: "/intro/gd-1.jpg" },
  { src: "/intro/gd-2.jpg" },
  { src: "/intro/gd-3.jpg" },
];

export default function GoodsSection() {
  const t = useT().thePathWeWalk;
  const slides: CarouselSlide[] = t.goods.tabs.map((tab, i) => ({
    tab: tab.name,
    img: IMGS[i].src,
    blocks: tab.blocks,
  }));
  return <TabCarousel label={t.sectionLabel} title={t.goods.title} slides={slides} />;
}

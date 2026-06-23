"use client";

import { useT } from "@/i18n/useT";
import TabCarousel, { type CarouselSlide } from "./TabCarousel";

/** "03. 우리가 걷는 길 contents-1.코리아둘레길" — 탭 6개 가로 캐러셀 (텍스트는 사전) */
const IMGS = [
  { src: "/intro/kdl-1.jpg" },
  { src: "/intro/kdl-2.jpg" },
  { src: "/intro/kdl-3.jpg" },
  { src: "/intro/kdl-4.jpg" },
  { src: "/intro/kdl-5.jpg" },
  { src: "/intro/kdl-6.jpg" },
];

export default function KoriaDulegilSection() {
  const t = useT().thePathWeWalk;
  const slides: CarouselSlide[] = t.koriaDulegil.tabs.map((tab, i) => ({
    tab: tab.name,
    img: IMGS[i].src,
    blocks: tab.blocks,
  }));
  return <TabCarousel label={t.sectionLabel} title={t.koriaDulegil.title} slides={slides} />;
}

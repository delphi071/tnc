"use client";

import { useT } from "@/i18n/useT";
import TabCarousel, { type CarouselSlide } from "./TabCarousel";

/** "03. 우리가 걷는 길 contents-3. 걷기기반 문화 프로그램" — 탭 5개 가로 캐러셀 (텍스트는 사전) */
const IMGS = [
  { src: "/intro/cf-1.jpg", video: true },
  { src: "/intro/cf-2.jpg" },
  { src: "/intro/cf-3.jpg" },
  { src: "/intro/cf-4.jpg", imgPos: "object-bottom" },
  { src: "/intro/cf-5.jpg", imgPos: "scale-[1.15] -translate-y-[26px]" },
];

export default function CultureProgramSection() {
  const t = useT().thePathWeWalk;
  const slides: CarouselSlide[] = t.culture.tabs.map((tab, i) => ({
    tab: tab.name,
    img: IMGS[i].src,
    imgPos: IMGS[i].imgPos,
    video: IMGS[i].video,
    blocks: tab.blocks,
  }));
  return <TabCarousel label={t.sectionLabel} title={t.culture.title} slides={slides} />;
}

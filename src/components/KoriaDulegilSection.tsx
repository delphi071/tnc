"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";
import TabCarousel, { type CarouselSlide } from "./TabCarousel";
import KoreaDulegilMap from "./KoreaDulegilMap";

/** "03. 우리가 걷는 길 contents-1.코리아둘레길" — 탭 7개 가로 캐러셀 (텍스트는 사전) */
const IMGS: { src?: string }[] = [
  // 지도·텍스트를 벡터 오버레이(KoreaDulegilMap)로 분리하면서 배경 사진만 남긴 새 에셋.
  // 파일명을 바꾼 건 CDN·Next 이미지 캐시가 예전(지도 구워진) 이미지를 계속 서빙해
  // 지도가 이중으로 겹쳐 보이는 문제를 막기 위함이다.
  { src: "/intro/kdl-1-v2.jpg" },
  { src: "/intro/kdl-2.jpg" },
  { src: "/intro/kdl-3.jpg" },
  { src: "/intro/kdl-4.jpg" },
  { src: "/intro/kdl-5.jpg" },
  { src: "/intro/kdl-6.jpg" },
  // 완보 인증 — 자료 준비 중이라 이미지 없음 (빈 카드로 표시)
  { src: undefined },
];

/** 해시 → 탭 인덱스. 컴포넌트 밖 상수라 렌더마다 새 객체가 생겨 effect 가 재실행되지 않는다. */
const HASH_TABS = { certifications: 6 };

export default function KoriaDulegilSection() {
  const t = useT().thePathWeWalk;
  // 영문 탭 7개는 기본 패딩(34)이면 탭 줄이 1100 을 넘쳐 마지막 탭이 밑줄 밖으로 나간다.
  // Figma 도 이 줄만 20 으로 좁혀 합계 1095 로 맞춰 놓았다. 한국어는 짧아 기본값으로 충분.
  const en = useLocale().locale === "en";
  const slides: CarouselSlide[] = t.koriaDulegil.tabs.map((tab, i) => ({
    tab: tab.name,
    img: IMGS[i].src,
    // 첫 슬라이드만 지도 오버레이 (배경 사진 위에 벡터로 그린다)
    overlay: i === 0 ? <KoreaDulegilMap /> : undefined,
    blocks: tab.blocks,
  }));
  return (
    <TabCarousel
      label={t.sectionLabel}
      title={t.koriaDulegil.title}
      slides={slides}
      tabPx={en ? 20 : undefined}
      // 헤더 우측 지도 아이콘 → /the-path-we-walk#certifications 로 들어오면 마지막 탭을 연다
      hashTabs={HASH_TABS}
    />
  );
}

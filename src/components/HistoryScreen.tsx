"use client";

/* eslint-disable @next/next/no-img-element */

import type { RefObject } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";

/** Figma "01. 우리의 길 > History" 전체 연혁 (밝은 배경).
 *  peel 로 드러난 뒤, 콘텐츠 전체가 위로 선형 스크롤(2024→2010).
 *  연도 좌표(row.y)·이미지 좌표는 Figma(node 1364:6879) 로컬 좌표를 스테이지 좌표로 변환한 값이다.
 *  (연혁 블록 원점 = Frame789 y728 + Frame537 y10 = 738 → row.y = 738 + Figma 로컬 y) */
const STAGE_W = 1920;
// 전체 콘텐츠 높이. 마지막 2010(y=5360)이 고정점(≈359)에 닿는 순간 스크롤이 끝나도록(over-scroll 없음)
// → 2010 연도·텍스트가 가림막 아래로 사라지지 않고, 이후 peel 단계에서 함께 위로 올라간다.
export const HISTORY_H = 5760;

export type Ev = { m?: string; t: string; s?: string };
export type Row = { year: string; y: number; events: Ev[] };

export const ROWS: Row[] = [
  { year: "2024", y: 738, events: [{ t: "‘DMZ평화의길’ 개통", s: "35개 코스, 510km" }, { t: "경기둘레길 노선확대조사" }] },
  { year: "2023", y: 910, events: [{ t: "강화나들길 명품화 연구" }] },
  {
    year: "2022", y: 1036,
    events: [
      { t: "‘서해랑길’ 개통", s: "109개 코스, 1,800km" },
      { t: "경기둘레길 통합 운영", s: "2022~현재" },
      { t: "울산 반구대 일원 역사문화탐방로 조성 기본계획" },
      { t: "영월 운탄고도 통합안내센터 관리운영방안 연구" },
      { t: "코리아둘레길 쉼터 운영을 위한 문화관광해설사 역량강화교육" },
    ],
  },
  {
    year: "2020", y: 1346,
    events: [
      { t: "‘남파랑길’ 개통", s: "50개 코스, 750km" },
      { t: "코리아둘레길 모니터링 및 안내사무국 운영", s: "2020~현재" },
      { t: "문화재청 명품 세계유산 둘레길 조성" },
      { t: "경기둘레길 관광자원 조사 및 시범구간 조성" },
      { t: "이천 정개산-원적산 및 산수유축제장 둘레길 기본계획 수립" },
      { t: "강릉 걷는 길 종합계획 수립 연구 용역" },
      { t: "KTO-KOICA 공동 안전여행 지킴이 남파랑길 모니터링단 운영" },
    ],
  },
  {
    year: "2019", y: 1748,
    events: [
      { t: "경남진주혁신도시 구도심간 역사문화둘레길 기본구상 연구" },
      { t: "경북 고령 대가야 걷는 길 노선개발 및 설계 시공 가이드라인" },
      { t: "남해바래길 모니터링" },
      { t: "해파랑길 모니터링단 교육 / 남해군 코리아둘레길 남해구간 교육" },
      { t: "서울시 문화관광해설사 도보관광코스 현장교육" },
    ],
  },
  { year: "2018", y: 2058, events: [{ t: "경기옛길 신설탐방로 노선조사∙개발∙제안" }, { t: "화성시 화성3.1운동 만세길 모니터링 및 콘텐츠 수집" }] },
  {
    year: "2017", y: 2230,
    events: [
      { t: "화성시 독립운동 유허지 정비 및 만세길 조성방안 연구" },
      { t: "산림청 양구DMZ펀치볼둘레길 운영관리방안 연구" },
      { t: "환경부 국가생태문화탐방로 성과평가" },
    ],
  },
  {
    year: "2016", y: 2432,
    events: [
      { m: "1월", t: "청소년여행문화학교 67~81차수 운영" },
      { m: "4월", t: "전국 걷기여행길 모니터링 진행" },
      { m: "5월", t: "해파랑길 개통기념 컨퍼런스 『대한민국 장거리 트레일의 현재와 미래』 주관" },
      { m: "6월", t: "걷기여행길 DB구축 및 콘텐츠 보강" },
      { m: "6월", t: "남한산성 옛길 연구 용역 진행" },
      { m: "7월", t: "코리아둘레길 사업 설명회 진행" },
      { m: "8월", t: "해파랑길 모니터링 및 안내체계 유지보수" },
      { m: "10월", t: "코리아둘레길 심포지움 주관" },
      { m: "11월", t: "코리아둘레길 실행계획 작성" },
    ],
  },
  {
    year: "2015", y: 2898,
    events: [
      { m: "1월", t: "걷기여행길 홈페이지 DB 및 콘텐츠 보강" },
      { m: "2월", t: "경기옛길 전 구간 전문가 점검 및 GIS정보 보완 용역 진행", s: "경기문화재단" },
      { m: "3월", t: "해파랑길 전문가 모니터링 및 간이안내사인 정비" },
      { m: "4월", t: "청소년여행문화학교 57~66차수 운영" },
      { m: "4월", t: "전국 걷기여행길 모니터링 진행" },
      { m: "5월", t: "충청남도 내포천주교 순례길 컨설팅 용역 진행" },
      { m: "9월", t: "두루누비 시범지역 실태조사 및 모니터링", s: "곡성,춘천,충주" },
      { m: "10월", t: "KBS 다큐공감 『길 위의 오남매』 제작 참여", s: "해파랑길" },
      { m: "11월", t: "가을 관광주간 가족걷기 행사 진행", s: "곡성 섬진강둘레길" },
    ],
  },
  {
    year: "2014", y: 3364,
    events: [
      { m: "3월", t: "걷기여행길 『이달의 추천길』 운영" },
      { m: "5월", t: "청소년여행문화학교 48~56차수 운영" },
      { m: "5월", t: "걷기여행길 DB구축 및 콘텐츠 보강" },
      { m: "5월", t: "해파랑길 운영 및 관리" },
      { m: "9월", t: "경북 청송군 덕천마을 둘레길 컨설팅", s: "청송군" },
      { m: "9월", t: "서울 마포 난지생명길 달빛걷기 행사 진행 2회" },
      { m: "10월", t: "경기옛길 영남길 기본계획 수립", s: "경기문화재단" },
    ],
  },
  {
    year: "2013", y: 3742,
    events: [
      { m: "2월", t: "해파랑길 운영 및 관리" },
      { m: "3월", t: "해파랑길 홈페이지 오픈" },
      { m: "4월", t: "청소년여행문화학교 35~45차수 운영" },
      { m: "4월", t: "애플리케이션 ‘두발로 2.0’ DB구축 및 콘텐츠 보강 현황조사" },
      { m: "5월", t: "양양 와일드 트레일 조성 계획, 발주처 양양군" },
      { m: "6월", t: "탐방로 컨설팅 운영", s: "서울 마포, 여주, 백령도, 김제, 신안, 포천, 진도, 성주, 진주" },
      { m: "7월", t: "국내 최초, 전국 걷는 길 현황 조사", s: "595개길 17,671km" },
      { m: "8월", t: "걷는 길 안내체계 가이드라인 연구" },
      { m: "9월", t: "걷기여행길(두루누비 전신) 홈페이지 DB 구축" },
    ],
  },
  {
    year: "2012", y: 4208,
    events: [
      { m: "1월", t: "2013 이야기가 있는 문화생태탐방로 선정 지원" },
      { m: "1월", t: "서울한양도성길 지도 국문, 영문, 일문 3종 발간" },
      { m: "2월", t: "해파랑가게 선정 및 지원" },
      { m: "2월", t: "탐방로 생태·문화 및 스토리텔링 보고서 발간" },
      { m: "2월", t: "문화생태탐방로 대상 탐방로 모니터링 및 평가 보고서 발간" },
      { m: "2월", t: "『지금, 이 길의 아름다움』 (문학동네) 도서 출간" },
      { m: "3월", t: "청소년여행문화학교 24~34차수 운영" },
      { m: "5월", t: "해파랑길 모니터링 및 홍보사업 - 기념품 제작, 팸투어, 공모전" },
      { m: "6월", t: "탐방로 민간 주관단체 운영활성화 워크숍 및 교육 진행" },
      { m: "8월", t: "해파랑길 사계사진 공모전" },
      { m: "9월", t: "해파랑길 전 구간 지도 발간" },
      { m: "10월", t: "문화생태탐방로 조성 컨설팅 진행", s: "부산, 남원, 익산, 보성, 충주, 홍성" },
      { m: "12월", t: "건전한 걷기여행문화 확산방안 워크숍 운영" },
    ],
  },
  {
    year: "2011", y: 4850,
    events: [
      { m: "1월", t: "2012 이야기가 있는 문화생태탐방로 선정 지원" },
      { m: "3월", t: "문화체육관광부『2011 이야기가 있는 문화생태탐방로 사업』진행" },
      { m: "3월", t: "청소년여행문화학교 9~23차수 운영" },
      { m: "4월", t: "탐방로 생태·문화자원의 보존·복원 대책을 위한 조사 실시" },
      { m: "5월", t: "탐방로 비즈니스 창출을 위한 지역 네트워킹 및 컨설팅 사업 진행" },
      { m: "5월", t: "해파랑길 조성 사업 진행", s: "지자체 협의, 770km 노선 확정" },
      { m: "10월", t: "가람길 따라 도보여행 애플리케이션 및 가이드북 제작" },
      { m: "11월", t: "해파랑길 선도지역 지도제작 지원", s: "부산, 경주, 강릉, 고성" },
      { m: "12월", t: "탐방로 표지 중심 탐방로 조성 매뉴얼 보고서 발간" },
      { m: "12월", t: "탐방로 법제도적 지원을 위한 정책 제안 보고서 발간" },
    ],
  },
  {
    year: "2010", y: 5360,
    events: [
      { m: "7월", t: "창립총회 및 문화체육관광부 법인인가 설립" },
      { m: "8월", t: "사단법인 한국의길과문화 설립, 김주영 이사장 취임" },
      { m: "8월", t: "문화체육관광부 『2010 이야기가 있는 문화생태탐방로 사업』 진행" },
      { m: "8월", t: "청소년여행문화학교 1~8차수 운영" },
      { m: "9월", t: "문화생태탐방로 모니터링 팸투어 8회 운영" },
      { m: "11월", t: "탐방로 심포지엄 『걷는 길, 이대로 좋은가』 개최" },
      { m: "12월", t: "해파랑길 대학생 탐사대 운영 지원" },
    ],
  },
];

/** 영문 연혁 — 연도·y 좌표는 ROWS 와 동일(스크롤 계산이 KO y 기준), 텍스트만 영문 (Figma EN node 1562:17624) */
export const ROWS_EN: Row[] = [
  { year: "2024", y: 738, events: [{ t: "Opened 'DMZ Peace Trail'", s: "35 courses, 510km" }, { t: "Gyeonggi Dullegil Route Expansion Survey" }] },
  { year: "2023", y: 910, events: [{ t: "Ganghwa Nadeulgil Optimization research" }] },
  {
    year: "2022", y: 1036,
    events: [
      { t: "Opened 'Seohaeranggil'", s: "109 courses, 1,800km" },
      { t: "Integrated Management of Gyeonggi Dullegil", s: "2022 ~" },
      { t: "Plan for Ulsan Bangudae Historical Trail" },
      { t: "Strategy for Yeongwol Untangodo Info Center" },
      { t: "Capacity Training for Korea Dullegil Tour Guides" },
    ],
  },
  {
    year: "2020", y: 1346,
    events: [
      { t: "Opened 'Namparanggil'", s: "50 courses, 750km" },
      { t: "Managed Korea Dullegil Monitoring & Info Office", s: "2020~" },
      { t: "Developed CHA World Heritage Trails" },
      { t: "Gyeonggi Dullegil Resource Survey & Pilot Sections" },
      { t: "Plan for Icheon Trails (Jeonggaesan/Wonjeoksan)" },
      { t: "Plan for Gangneung Walking Trails" },
      { t: "Operated KTO-KOICA Namparanggil Safety Monitoring Team" },
    ],
  },
  {
    year: "2019", y: 1748,
    events: [
      { t: "Concept research for Jinju Historical Trail" },
      { t: "Guidelines for Goryeong Daegaya Walking Trail" },
      { t: "Namhae Baraegil Monitoring" },
      { t: "Haeparanggil & Namhae Dullegil Guide Training" },
      { t: "On-site Training for Seoul Walking Tour Guides" },
    ],
  },
  { year: "2018", y: 2058, events: [{ t: "Surveyed & Developed New Gyeonggi Old Trails" }, { t: "Monitored Hwaseong March 1st Movement Trail" }] },
  {
    year: "2017", y: 2230,
    events: [
      { t: "Development Study for Hwaseong Independence Trail" },
      { t: "Management Study for Yanggu DMZ Punchbowl Trail" },
      { t: "Performance Evaluation of National Eco-Trails (MOE)" },
    ],
  },
  {
    year: "2016", y: 2432,
    events: [
      { m: "Jan", t: "Youth Travel Culture School Sessions 67 to 81" },
      { m: "Apr", t: "Monitored nationwide walking trails" },
      { m: "May", t: "Hosted Haeparang Trail Opening Conference" },
      { m: "Jun", t: "Upgraded trail DB" },
      { m: "Jun", t: "Studied Namhansanseong Historic Trail" },
      { m: "Jul", t: "Held Korea Dulle-gil Project Information Session" },
      { m: "Aug", t: "Maintained Haeparang Trail monitoring and signage" },
      { m: "Oct", t: "Hosted Korea Dulle-gil Symposium" },
      { m: "Nov", t: "Drafted Korea Dulle-gil Action Plan" },
    ],
  },
  {
    year: "2015", y: 2898,
    events: [
      { m: "Jan", t: "Upgraded walking trail website DB" },
      { m: "Feb", t: "Inspected Gyeonggi Yetgil and updated GIS data", s: "Gyeonggi Cultural Foundation" },
      { m: "Mar", t: "Monitored Haeparang Trail and restored signage" },
      { m: "Apr", t: "Youth Travel Culture School Sessions 57 to 66" },
      { m: "Apr", t: "Monitored nationwide walking trails" },
      { m: "May", t: "Consulted on Naepo Catholic Pilgrimage Route" },
      { m: "Sep", t: "Evaluated Durunubi pilot regions", s: "Gokseong, Chuncheon, Chungju" },
      { m: "Oct", t: "Featured in KBS Documentary Five Siblings on the Trail", s: "Haeparang Trail" },
      { m: "Nov", t: "Hosted Autumn Tourism Week Family Walk", s: "Gokseong Seomjingang River Trail" },
    ],
  },
  {
    year: "2014", y: 3364,
    events: [
      { m: "Mar", t: "Managed Recommended Trails of the Month" },
      { m: "May", t: "Youth Travel Culture School Sessions 48 to 56" },
      { m: "May", t: "Upgraded trail DB" },
      { m: "May", t: "Managed Haeparang Trail" },
      { m: "Sep", t: "Consulted on Deokcheon Village Trail", s: "Cheongsong-gun" },
      { m: "Sep", t: "Hosted Nanji Saengmyeong-gil Moonlight Walk" },
      { m: "Oct", t: "Formulated Master Plan for Gyeonggi Yetgil Yeongnam-gil", s: "Gyeonggi Cultural Foundation" },
    ],
  },
  {
    year: "2013", y: 3742,
    events: [
      { m: "Feb", t: "Managed Haeparang Trail operations" },
      { m: "Mar", t: "Launched official Haeparang Trail website" },
      { m: "Apr", t: "Youth Travel Culture School Sessions 35 to 45" },
      { m: "Apr", t: "Updated Duballo 2.0 app DB" },
      { m: "May", t: "Planned Yangyang Wild Trail development" },
      { m: "Jun", t: "Consulted on regional trail operations in 9 locations", s: "Seoul Mapo, Yeoju, Baengnyeongdo, Gimje, Sinan, Pocheon, Jindo, Seongju, Jinju" },
      { m: "Jul", t: "Conducted first National Walking Trail Survey", s: "595 routes, 17,671km" },
      { m: "Aug", t: "Researched trail signage guidelines" },
      { m: "Sep", t: "Built walking trail website DB" },
    ],
  },
  {
    year: "2012", y: 4208,
    events: [
      { m: "Jan", t: "Supported 2013 Cultural Trail selections" },
      { m: "Jan", t: "Published Seoul City Wall Trail maps" },
      { m: "Feb", t: "Designated Haeparang Stores" },
      { m: "Feb", t: "Published trail reports" },
      { m: "Feb", t: "Published trail monitoring and evaluation reports" },
      { m: "Feb", t: "Published book The Beauty of This Trail" },
      { m: "Mar", t: "Youth Travel Culture School Sessions 24 to 34" },
      { m: "May", t: "Promoted Haeparang Trail with fam tours and contests" },
      { m: "Jun", t: "Hosted workshops for trail operating NGOs" },
      { m: "Aug", t: "Held Haeparang Trail Photo Contest" },
      { m: "Sep", t: "Published full route map of Haeparang Trail" },
      { m: "Oct", t: "Consulted on Cultural and Ecological Trails in 6 regions", s: "Busan, Namwon, Iksan, Boseong, Chungju, Hongseong" },
      { m: "Dec", t: "Hosted workshop on healthy walking culture" },
    ],
  },
  {
    year: "2011", y: 4850,
    events: [
      { m: "Jan", t: "Supported 2012 Cultural Trail selections" },
      { m: "Mar", t: "Executed MCST 2011 Cultural Trail Project" },
      { m: "Mar", t: "Youth Travel Culture School Sessions 9 to 23" },
      { m: "Apr", t: "Surveyed trail conservation and restoration plans" },
      { m: "May", t: "Consulted on regional trail businesses" },
      { m: "May", t: "Finalized Haeparang Trail route 770km", s: "Municipal consultation, 770km route confirmed" },
      { m: "Oct", t: "Developed Garamgil walking app and guidebook" },
      { m: "Nov", t: "Published maps for key Haeparang Trail areas", s: "Busan, Gyeongju, Gangneung, Goseong" },
      { m: "Dec", t: "Published Trail Signage Manuals" },
      { m: "Dec", t: "Published Policy Recommendations" },
    ],
  },
  {
    year: "2010", y: 5360,
    events: [
      { m: "Jul", t: "Received MCST corporate authorization" },
      { m: "Aug", t: "Established Korea Trail Culture Association" },
      { m: "Aug", t: "Executed MCST 2010 Cultural Trail Project" },
      { m: "Aug", t: "Youth Travel Culture School Sessions 1 to 8" },
      { m: "Sep", t: "Conducted 8 trail monitoring fam tours" },
      { m: "Nov", t: "Hosted Trail Symposium Walking Trails Are They on the Right Track" },
      { m: "Dec", t: "Supported Haeparang Trail Student Expedition" },
    ],
  },
];

/** 연도별 이미지 (Figma node 1364:6879 좌표 그대로). 좌측 열에 배치, 우측 연혁 텍스트와 겹치지 않는다. */
const IMAGES = [
  { src: "hist-2024", x: 320, y: 728, w: 408, h: 260 },
  { src: "hist-namhae", x: 457, y: 1454, w: 271, h: 379 },
  { src: "hist-0418", x: 0, y: 1962, w: 608, h: 306 },
  { src: "hist-0824", x: 434, y: 2671, w: 294, h: 264 },
  { src: "hist-1529", x: 125, y: 3498, w: 505, h: 310 },
  { src: "hist-0410", x: 463, y: 3937, w: 245, h: 385 },
  { src: "hist-1025", x: 0, y: 4931, w: 630, h: 281 },
];

const ACTIVE = "2024"; // 초기(스크립트 로드 전) 활성 연도
/** 연도 행 y좌표 (OurWayHero 의 활성 연도 계산과 공유, 렌더 순서와 동일) */
export const HISTORY_ROW_Y = ROWS.map((r) => r.y);

export default function HistoryScreen({
  scale,
  contentRef,
}: {
  scale: number;
  contentRef?: RefObject<HTMLDivElement | null>;
}) {
  const h = useT().ourWay.history;
  const en = useLocale().locale === "en";
  const rows = en ? ROWS_EN : ROWS;
  const evFont = en ? "var(--font-montserrat)" : undefined; // EN 이벤트는 Montserrat, KO는 기본(Pretendard)
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#f0f0f0]">
      {/* 스크롤되는 전체 콘텐츠 (OurWayHero 가 translateY 로 이동) */}
      <div ref={contentRef} className="absolute left-0 top-0 w-full" style={{ willChange: "transform" }}>
        <div
          className="absolute left-1/2 top-0"
          style={{ width: STAGE_W, height: HISTORY_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
        >
          <p className="absolute text-center font-bold text-black" style={{ left: 360, right: 360, top: 359, fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.32px" }}>
            {h.subtitle}
          </p>
          <div className="absolute text-center text-[#5a5b5d]" style={{ left: 0, right: 0, top: 446, fontSize: 18, lineHeight: 1.45, letterSpacing: "-0.36px" }}>
            {h.intro.map((line, i) => (
              <p key={i}>{line === "" ? " " : line}</p>
            ))}
          </div>

          {/* 세로선 (마지막 2010 아래까지 연장) */}
          <div className="absolute bg-[#d9d9d9]" style={{ left: 961, top: 745, width: 2, height: 4930 }} />
          {/* 상단 고정 녹색 점 (OurWayHero 가 매 프레임 top 을 보정해 화면 고정 위치 유지) */}
          <span
            data-history-dot
            className="absolute rounded-full bg-[#0ac200]"
            style={{ left: 951, top: 726, width: 22, height: 22 }}
          />

          {/* 연도별 이미지 */}
          {IMAGES.map((im) => (
            <div
              key={im.src}
              data-hist-img
              className="absolute overflow-hidden"
              style={{ left: im.x, top: im.y, width: im.w, height: im.h, borderTopLeftRadius: 50, borderBottomRightRadius: 50, willChange: "transform" }}
            >
              <img src={`/intro/${im.src}.jpg`} alt="" className="h-full w-full object-cover" />
            </div>
          ))}

          {/* 연도 + 이벤트 (활성 연도는 data-active 로 토글) */}
          {rows.map((row) => (
            <div
              key={row.year}
              data-hist-row
              data-active={row.year === ACTIVE ? "true" : "false"}
              className="hist-row absolute"
              style={{ top: row.y, left: 0, right: 0 }}
            >
              <p
                className="hist-year absolute text-right font-bold"
                style={{ left: 795, width: 140, fontSize: 40, lineHeight: 1, fontFamily: "var(--font-montserrat)" }}
              >
                {row.year}
              </p>
              {/* 이벤트 열: 텍스트는 항상 left 1045 에서 시작, 월(m)은 그 왼쪽에 걸린다(hanging, x≈999) →
                  월 없는 연도(2024~2017)와 월 있는 연도(2016~2010)의 본문이 같은 x 에 정렬되고,
                  월/텍스트가 가운데 세로선의 녹색 점(x≈951~973)과 겹치지 않도록 우측으로 띄운다. */}
              <div className="absolute flex flex-col" style={{ left: 1045, width: 820, rowGap: 23 }}>
                {row.events.map((e, j) => (
                  <div key={j} className="relative" style={{ lineHeight: 1.3 }}>
                    {e.m && (
                      <span
                        className="hist-ev absolute font-bold"
                        style={{ left: -46, top: 0, width: 40, fontSize: 16, fontFamily: evFont }}
                      >
                        {e.m}
                      </span>
                    )}
                    <p className="hist-ev font-bold" style={{ fontSize: 16, fontFamily: evFont }}>
                      {e.t}
                      {e.s && (
                        <span className="hist-sub" style={{ fontSize: 14, fontWeight: 400, marginLeft: 8, fontFamily: evFont }}>
                          {e.s}
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 고정: 상단 'History' 제목 + 배경 가림막(고정선까지). 스크롤 콘텐츠는 이 아래로 지나가며 사라진다. */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-10"
        style={{ width: STAGE_W, height: HISTORY_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
      >
        {/* 가림막: 상단~고정선(약 350). 그 위로 올라간 연혁/텍스트가 사라진다. */}
        <div className="absolute inset-x-0 top-0 bg-[#f0f0f0]" style={{ height: 350 }} />
        <p
          className="absolute text-center font-bold text-[#0ac200]"
          style={{ left: 0, right: 0, top: 200, fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}
        >
          History
        </p>
      </div>
    </section>
  );
}

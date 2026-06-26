"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useT } from "@/i18n/useT";
import { ROWS } from "./HistoryScreen";
import { ROW1, ROW2, TEAMS } from "./OrgChartScreen";

/** People 이사진(7인) — 모바일은 세로로 나열 */
const BOARD = [...ROW1, ...ROW2];

/** 모바일 Vision 헤드라인 — 디자인상 4줄로 끊어서 표시(ko). en 은 사전 그대로. */
const VISION_LINES_KO = ["걷는 길이 행복한", "이야기가 되는 곳,", "대한민국", "걷기 문화의 중심"];

/** History 타임라인: 특정 연도 다음에 끼우는 이미지 (PC hist-*.jpg 재사용) */
const HIST_IMG_AFTER: Record<string, string> = {
  "2023": "hist-2024",
  "2020": "hist-namhae",
  "2019": "hist-0418",
  "2016": "hist-0824",
  "2012": "hist-1529",
};
/** 특정 이미지 보정 클래스. hist-namhae 는 왼쪽 가장자리에 검은 띠가 박혀 있고
 *  가로를 꽉 채워(object-position 무효) → 오른쪽 기준으로 살짝 확대해 왼쪽으로 밀어 검은 띠를 잘라냄. */
const HIST_IMG_POS: Record<string, string> = {
  "2020": "origin-right scale-[1.1]",
};

/** 우리의 길 — 모바일(lg 미만) 전용. PC 의 "벗겨지는(peel)" 스크롤을 모바일 레이아웃으로 재현.
 *  [현재 단계] Hero(base) → Mission.
 *    Mission 은 "카드 스택" peel: 인트로(헤드라인/설명) 위에 원01·02·03 을 같은 자리에 겹쳐 쌓고,
 *    스크롤하면 맨 위 카드가 위로 벗겨지며 아래 카드가 드러난다 (인트로 → 01 → 02 → 03).
 *  이후 Vision · Core Value(큐브) · History · People · Location 을 단계적으로 확장한다.
 *  문구는 PC 와 동일한 사전(ourWay.*)을 그대로 사용. */

/** 스크롤 트랙 길이(vh) — 핀 고정 구간 = TRACK_VH − 100. 카드(섹션)가 늘면 같이 키운다. */
const TRACK_VH = 1700;
/** 진행도 분기(0→1): [0~M_COVER] 카드 스택이 hero 를 덮음 / [M_COVER~1] 카드 peel + 큐브 + 내부 스크롤 */
const M_COVER = 0.05;
/** 내부 세로 스크롤(타임라인/조직도)이 차지하는 가중치(peel 1단계 = 가중치 1 기준) */
const HIST_W = 5;
const PEOPLE_W = 4;
/** 카드 단계당 머무는(dwell) 비율 — 각 카드가 잠시 멈춘 뒤 위로 벗겨진다 */
const CARD_HOLD = 0.45;
/** Core Value 큐브: 4면 = 3회전. 각 회전 단계 dwell */
const CUBE_ROTS = 3;
const CUBE_HOLD = 0.5;
/** 큐브 면 높이/깊이 (모바일 세로 면: 아이콘 + 텍스트) */
const CUBE_FACE_H = 380;
const CUBE_DEPTH = 190;
/** 값 아이콘 (텍스트는 사전 coreValue[k]) — PC SVG 재사용 */
const CV_ICONS = ["cv-discovery", "cv-connection", "cv-sustainability", "cv-trust"];

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smoothstep = (x: number) => x * x * (3 - 2 * x);

/** 헤더를 라이트 테마로 바꿔야 하는(=밝은 배경) 섹션 종류 */
const LIGHT_KINDS = new Set(["core", "history", "people", "location"]);

export default function OurWayMobile({ onLightChange }: { onLightChange?: (light: boolean) => void }) {
  const ow = useT().ourWay;
  const { locale } = useLocale();
  const visionLines = locale === "ko" ? VISION_LINES_KO : ow.vision.headline;
  const trackRef = useRef<HTMLDivElement>(null);
  const heroFgRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const histContentRef = useRef<HTMLDivElement>(null);
  const peopleContentRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef(false);

  // 스크롤 진행도 → Mission 덮기 + 카드 스택 peel
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      const coverP = clamp01(progress / M_COVER);
      const peelP = clamp01((progress - M_COVER) / (1 - M_COVER));

      // hero 전경은 위로 걷히고, Mission 패널(카드 스택)은 밑에서 올라와 덮는다
      if (heroFgRef.current) heroFgRef.current.style.transform = `translateY(${-coverP * 100}%)`;
      const mission = missionRef.current;
      if (!mission) return;
      mission.style.transform = `translateY(${(1 - coverP) * 100}%)`;

      // 카드 스택 peel: card k(맨 위부터) 가 segment k 에서 위로 벗겨진다. 마지막 카드는 고정.
      // phase(가중치) 타임라인 구성 — 순서: [카드 revea l후 내부연출(큐브/연혁스크롤)] → [그 카드 peel].
      //   카드 peel=가중치1, Core Value 큐브=CUBE_ROTS, History 스크롤=HIST_W. 마지막 카드는 peel 없음.
      const cards = mission.querySelectorAll<HTMLElement>("[data-card]");
      const last = cards.length - 1;
      let acc = 0;
      const peelStart: number[] = [];
      let cubeStart = -1;
      let histStart = -1;
      let peopleStart = -1;
      cards.forEach((card, k) => {
        const kind = card.dataset.card;
        if (kind === "core") {
          cubeStart = acc;
          acc += CUBE_ROTS;
        }
        if (kind === "history") {
          histStart = acc;
          acc += HIST_W;
        }
        if (kind === "people") {
          peopleStart = acc;
          acc += PEOPLE_W;
        }
        peelStart[k] = k < last ? acc : -1;
        if (k < last) acc += 1;
      });
      const g = peelP * acc; // 전체 가중치(acc) 기준 현재 위치

      // 카드 peel (각 카드 가중치 1, dwell 후 위로 벗겨짐) + 헤더를 덮은 최상단 카드 판별
      let topKind = "intro";
      let topFound = false;
      cards.forEach((card, k) => {
        let ty = 0;
        if (peelStart[k] >= 0) {
          const local = clamp01(g - peelStart[k]);
          const eased = local <= CARD_HOLD ? 0 : smoothstep((local - CARD_HOLD) / (1 - CARD_HOLD));
          ty = -eased * 110; // 위로 110%(완전히 화면 밖) 까지 벗겨짐
        }
        card.style.transform = `translateY(${ty}%)`;
        // 아직 헤더(상단)를 덮고 있는(거의 안 벗겨진) 첫 카드 = 현재 헤더 뒤 배경
        if (!topFound && ty > -90) {
          topFound = true;
          topKind = card.dataset.card || "";
        }
      });
      // 밝은 섹션이 헤더를 덮으면 헤더를 라이트 테마로 전환
      const light = LIGHT_KINDS.has(topKind);
      if (lightRef.current !== light) {
        lightRef.current = light;
        onLightChange?.(light);
      }

      // Core Value 큐브 — Core Value 가 드러난 뒤 단계별 회전(4면)
      const cube = cubeRef.current;
      if (cube && cubeStart >= 0) {
        const raw = Math.min(Math.max(g - cubeStart, 0), CUBE_ROTS); // 0~3
        const ci = Math.min(Math.floor(raw), CUBE_ROTS - 1);
        const cf = raw - ci;
        const ct = cf <= CUBE_HOLD ? 0 : smoothstep((cf - CUBE_HOLD) / (1 - CUBE_HOLD));
        cube.style.transform = `translateZ(-${CUBE_DEPTH}px) rotateX(${(ci + ct) * 90}deg)`;
      }

      // History 타임라인 — 드러난 뒤 내부 콘텐츠가 위로 세로 스크롤
      const hist = histContentRef.current;
      if (hist && histStart >= 0) {
        const raw = clamp01((g - histStart) / HIST_W);
        const maxScroll = Math.max(hist.scrollHeight - vh, 0);
        hist.style.transform = `translateY(${-raw * maxScroll}px)`;
      }

      // People 조직도 — 드러난 뒤 내부 콘텐츠가 위로 세로 스크롤
      const people = peopleContentRef.current;
      if (people && peopleStart >= 0) {
        const raw = clamp01((g - peopleStart) / PEOPLE_W);
        const maxScroll = Math.max(people.scrollHeight - vh, 0);
        people.style.transform = `translateY(${-raw * maxScroll}px)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="lg:hidden">
      <div ref={trackRef} className="relative" style={{ height: `${TRACK_VH}vh` }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
          {/* 배경 (고정) — 길이 보이도록 object-position 오른쪽으로 */}
          <Image
            src="/intro/bg-1-v2.jpg"
            alt="우리의 길"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_center]"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-black/60 to-[97%]" />

          {/* Hero 전경 (base) — Mission 이 덮을 때 위로 걷힌다 */}
          <div ref={heroFgRef} className="absolute inset-0 z-10 px-[34px] pt-[155px]" style={{ willChange: "transform" }}>
            <h1
              className="text-[50px] font-extrabold leading-[1.2] text-[#0ac200]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span className="block">Beyond</span>
              <span className="block">the Route</span>
            </h1>
            <div className="mt-[39px] flex max-w-[250px] flex-col gap-6 text-white">
              <p className="text-[30px] font-extrabold leading-[0.9]">{ow.hero.title}</p>
              <div className="text-[20px] leading-[1.45]">
                {ow.hero.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Mission 패널 — 밑에서 올라와 덮음. 안에 카드 스택(인트로 + 원01·02·03) */}
          <div
            ref={missionRef}
            className="absolute inset-0 z-20"
            style={{ transform: "translateY(100%)", willChange: "transform" }}
          >
            {/* 백드롭 (불투명) — 카드가 벗겨지면 비치는 공통 배경 */}
            <Image src="/intro/bg-1-v2.jpg" alt="" fill sizes="100vw" className="object-cover object-[65%_center]" />
            <div className="absolute inset-0 bg-black/65" />

            {/* card 0: 인트로 (불투명) — 헤드라인 + 설명. 맨 위(z 100), 가장 먼저 벗겨짐 */}
            <div data-card="intro" className="absolute inset-0" style={{ zIndex: 100, willChange: "transform" }}>
              <Image src="/intro/bg-1-v2.jpg" alt="" fill sizes="100vw" className="object-cover object-[65%_center]" />
              <div className="absolute inset-0 bg-black/65" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <p
                  className="text-[24px] font-bold leading-[1.2] text-[#0ac200]"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Mission
                </p>
                <div className="mt-[40px] flex flex-col items-center gap-5">
                  <div className="text-[36px] font-bold leading-[1.2] tracking-[-0.36px] text-white">
                    {ow.mission.headline.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <div className="text-[18px] leading-[1.45] tracking-[-0.36px] text-white/90">
                    {ow.mission.desc.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* card 1~3: 원01·02·03. 배경은 맨 아래(03)에만 둬서 정적으로 깔리게 하고,
                01·02 는 투명(원만)으로 위로 벗겨진다 → 스크롤 중 배경이 바뀌지 않음.
                (원은 불투명이라 01>02>03 순으로 서로를 가리고, 03 배경이 아래 Vision 을 가림) */}
            {ow.mission.circles.map((lines, ci) => {
              const isLast = ci === ow.mission.circles.length - 1;
              return (
              <div
                key={ci}
                data-card="circle"
                className="absolute inset-0"
                style={{ zIndex: 90 - ci * 10, willChange: "transform" }}
              >
                {isLast && (
                  <>
                    <Image src="/intro/bg-1-v2.jpg" alt="" fill sizes="100vw" className="object-cover object-[65%_center]" />
                    <div className="absolute inset-0 bg-black/65" />
                  </>
                )}
                <div className="absolute inset-0 flex items-center justify-center px-6">
                  <div
                    className="flex h-[270px] w-[270px] items-center justify-center rounded-full bg-[#0ac200] text-center text-black"
                    style={{ boxShadow: "0 0 60px rgba(10,194,0,0.35)" }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-[24px] font-bold leading-none" style={{ fontFamily: "var(--font-montserrat)" }}>
                        {String(ci + 1).padStart(2, "0")}
                      </p>
                      <div className="text-[18px] leading-[1.5] tracking-[-0.9px]">
                        {lines.map((l, i) => (
                          <p key={i}>{l}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}

            {/* card 4: Vision (불투명) — 원03 이 벗겨지면 드러남 (z 60) */}
            <div data-card="vision" className="absolute inset-0" style={{ zIndex: 60, willChange: "transform" }}>
              <Image src="/intro/bg-vision.jpg" alt="" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <p
                className="absolute inset-x-0 top-[100px] text-center text-[24px] font-bold leading-[1.2] text-[#0ac200]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Vision
              </p>
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div className="text-[40px] font-bold leading-[1.5] tracking-[-0.8px] text-white">
                  {visionLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* card 5: Core Value (불투명, 밝은 배경) — Vision 이 벗겨지면 드러남.
                4개 값(아이콘+텍스트)을 PC 처럼 3D 큐브(rotateX)로 회전 표시 (z 50) */}
            <div data-card="core" className="absolute inset-0 bg-[#f0f0f0]" style={{ zIndex: 50, willChange: "transform" }}>
              <p
                className="absolute inset-x-0 top-[100px] text-center text-[24px] font-bold leading-[1.2] text-[#0ac200]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Core Value
              </p>
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <div style={{ perspective: 1500, width: "100%", maxWidth: 340, height: CUBE_FACE_H }}>
                  <div
                    ref={cubeRef}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                      transform: `translateZ(-${CUBE_DEPTH}px) rotateX(0deg)`,
                    }}
                  >
                    {ow.coreValue.map((v, k) => (
                      <div
                        key={k}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-10 text-center"
                        style={{ transform: `rotateX(${-90 * k}deg) translateZ(${CUBE_DEPTH}px)`, backfaceVisibility: "hidden" }}
                      >
                        <img src={`/intro/${CV_ICONS[k]}.svg`} alt="" width={180} height={180} />
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex flex-col items-center gap-1.5">
                            <p className="text-[14px] font-bold leading-none text-[#0ac200]" style={{ fontFamily: "var(--font-montserrat)" }}>
                              {v.eyebrow}
                            </p>
                            <p className="text-[24px] font-bold leading-[1.2] tracking-[-0.24px] text-black">{v.title}</p>
                            <p className="text-[14px] leading-[1.3] tracking-[-0.14px] text-[#5a5b5d]">{v.sub}</p>
                          </div>
                          <p className="text-[18px] leading-[1.3] tracking-[-0.18px] text-black">{v.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* card 6: History (밝은 배경) — Core Value 가 벗겨지면 드러나고, 내부 타임라인이 세로 스크롤 (z 40) */}
            <div data-card="history" className="absolute inset-0 overflow-hidden bg-[#f0f0f0]" style={{ zIndex: 40, willChange: "transform" }}>
              <div ref={histContentRef} className="absolute left-0 top-0 w-full px-[18px]" style={{ willChange: "transform" }}>
                {/* 인트로 */}
                <div className="flex flex-col items-center gap-[50px] pt-[100px] text-center text-black">
                  <p className="text-[24px] font-bold leading-[1.2] text-[#0ac200]" style={{ fontFamily: "var(--font-montserrat)" }}>
                    History
                  </p>
                  <div className="flex flex-col items-center gap-5">
                    <p className="text-[24px] font-bold leading-[1.2] tracking-[-0.24px]">{ow.history.subtitle}</p>
                    <div className="text-[18px] leading-[1.3] tracking-[-0.18px]">
                      {ow.history.intro.map((line, i) => (
                        <p key={i}>{line === "" ? " " : line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 타임라인 — 좌측 정렬: 연도(42px) + 이벤트들, 특정 연도 뒤 이미지 */}
                <div className="flex flex-col gap-[34px] pb-[120px] pt-[60px]">
                  {ROWS.map((row) => (
                    <Fragment key={row.year}>
                      <div className="flex flex-col gap-2">
                        <p
                          className="text-[42px] font-extrabold leading-[1.1] tracking-[-0.42px] text-black"
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {row.year}
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {row.events.map((e, j) => (
                            <p key={j} className="leading-[1.3]">
                              <span className="text-[15px] font-extrabold tracking-[-0.15px] text-black">{e.t}</span>
                              {e.s && <span className="ml-2 text-[14px] tracking-[-0.14px] text-[#5a5b5d]">{e.s}</span>}
                            </p>
                          ))}
                        </div>
                      </div>
                      {HIST_IMG_AFTER[row.year] && (
                        <div className="overflow-hidden rounded-tl-[40px] rounded-br-[40px]">
                          <img
                            src={`/intro/${HIST_IMG_AFTER[row.year]}.jpg`}
                            alt=""
                            className={`h-[200px] w-full object-cover ${HIST_IMG_POS[row.year] ?? "object-center"}`}
                          />
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* card 7: People (조직도, 밝은 배경) — History 가 벗겨지면 드러나고, 내부 조직도가 세로 스크롤 (z 30) */}
            <div data-card="people" className="absolute inset-0 overflow-hidden bg-[#f0f0f0]" style={{ zIndex: 30, willChange: "transform" }}>
              <div ref={peopleContentRef} className="absolute left-0 top-0 w-full px-[18px]" style={{ willChange: "transform" }}>
                {/* 인트로 */}
                <div className="flex flex-col items-center gap-[40px] pt-[100px] text-center">
                  <p className="text-[24px] font-bold leading-[1.2] text-[#0ac200]" style={{ fontFamily: "var(--font-montserrat)" }}>
                    People
                  </p>
                  <p className="text-[24px] font-bold leading-[1.2] tracking-[-0.24px] text-black">{ow.people.subtitle}</p>
                </div>

                {/* 조직도 */}
                <div className="flex flex-col items-center pb-[120px] pt-[40px]">
                  {/* 이사장 → 감사 / 이사진 (점선 커넥터) */}
                  <div className="relative w-full" style={{ height: 150 }}>
                    {/* 세로 점선 (이사장 → 이사진) */}
                    <div className="absolute left-1/2 top-[44px] border-l border-dashed border-[#9a9a9a]" style={{ height: 106 }} />
                    {/* 가로 점선 (→ 감사) */}
                    <div className="absolute left-1/2 top-[88px] border-t border-dashed border-[#9a9a9a]" style={{ width: 40 }} />
                    {/* 분기 점 */}
                    <div className="absolute left-1/2 top-[44px] size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9a9a9a]" />
                    <div className="absolute left-1/2 top-[88px] size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9a9a9a]" />
                    {/* 이사장 (상단 중앙) */}
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0ac200] px-9 py-3 text-[14px] text-white">
                      <span className="font-extrabold">이사장</span>
                      <span className="ml-2">홍성운</span>
                    </div>
                    {/* 감사 (오른쪽) */}
                    <div className="absolute right-0 top-[66px] whitespace-nowrap rounded-full bg-[#0ac200] px-4 py-3 text-[14px] text-white">
                      <span className="font-extrabold">감사</span>
                      <span className="ml-1.5">전영길 회계사</span>
                    </div>
                  </div>

                  {/* 이사진 + 7인 + 안내 */}
                  <div className="w-full">
                    <div className="rounded-full bg-[#0ac200] py-3 text-center text-[14px] font-extrabold text-white">이사진</div>
                    <div className="mt-3 flex flex-col gap-2">
                      {BOARD.map((m) => (
                        <div key={m.n} className="rounded-full border border-[#0ac200] py-3 text-center text-[14px] text-[#0ac200]">
                          {m.n} {m.r}
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 text-center text-[14px] leading-[1.5] text-black">
                      이사회는 (사)한국의길과문화
                      <br />
                      사업과 운영에 관한 사항을 심의, 의결합니다.
                    </p>
                  </div>

                  {/* 사무처 */}
                  <div className="mt-[30px] w-full rounded-full bg-[#0ac200] py-3 text-center text-[14px] font-extrabold text-white">사무처</div>
                  {/* 세로 점선 (사무처 → 3팀) */}
                  <div className="h-[22px] w-0 border-l border-dashed border-[#9a9a9a]" />

                  {/* 3팀 (세로 스택) */}
                  <div className="flex w-full flex-col gap-[14px]">
                    {TEAMS.map((t) => (
                      <div key={t.name} className="w-full">
                        <div className="rounded-t-[20px] border border-b-0 border-[#0ac200] py-2.5 text-center text-[14px] font-bold text-[#0ac200]">
                          {t.name}
                        </div>
                        <div className="flex flex-col gap-0.5 rounded-b-[20px] border border-[#0ac200] py-2.5 text-center text-[14px] text-[#0ac200]">
                          {t.items.map((it) => (
                            <p key={it}>{it}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* card 8: Location (약도/주소, 밝은 배경) — People 이 벗겨지면 드러나는 마지막 카드 (z 20) */}
            <div data-card="location" className="absolute inset-0 overflow-hidden bg-[#f0f0f0]" style={{ zIndex: 20 }}>
              <div className="flex h-full flex-col items-center px-[18px] pt-[100px]">
                <p className="text-[24px] font-bold leading-[1.2] text-[#0ac200]" style={{ fontFamily: "var(--font-montserrat)" }}>
                  Location
                </p>
                <p className="mt-5 text-[24px] font-bold leading-[1.2] tracking-[-0.24px] text-black">{ow.location.subtitle}</p>
                <img src="/intro/map.png" alt="오시는 길 약도" className="mt-8 w-full max-w-[330px] object-contain" />
                <div className="mt-8 flex w-full max-w-[330px] flex-col items-start gap-4">
                  {ow.location.info.map((t) => (
                    <div key={t} className="flex items-start gap-3">
                      <span className="mt-0.5 size-6 shrink-0 rounded-full border border-[#0ac200]" />
                      <span className="text-[18px] leading-[1.3] tracking-[-0.18px] text-black">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

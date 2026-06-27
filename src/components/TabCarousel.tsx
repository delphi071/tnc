"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import VideoModal from "./VideoModal";

/** "우리가 걷는 길" 콘텐츠 공용 — 탭 클릭형 가로 캐러셀.
 *  1920 스테이지 좌표 기준 left410 top238 에 배치 (스케일 스테이지 안에서 사용).
 *  탭 라벨(slide.tab)이 탭 버튼과 슬라이드 대제목으로 함께 쓰임. */
export type CarouselSlide = {
  tab: string;
  img: string;
  /** Tailwind object-position 클래스 (기본 object-center) */
  imgPos?: string;
  /** 영상 썸네일(어두운 오버레이 + 재생 버튼) 여부 */
  video?: boolean;
  /** 재생 시 임베드할 영상 URL (구글드라이브 .../preview 등). 없으면 클릭해도 동작 안 함 */
  videoUrl?: string;
  /** 블록: 소제목(h)은 선택 */
  blocks: { h?: string; lines: string[] }[];
};

const SLIDE_W = 1100;
const GAP = 460;

export default function TabCarousel({ label, title, slides }: { label: string; title: string; slides: CarouselSlide[] }) {
  const [active, setActive] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  // 영문 본문은 단락 통째라 컬럼 폭에서 자동 줄바꿈, 한국어는 사전 줄나눔(nowrap) 유지
  const en = useLocale().locale === "en";

  return (
    <div className="absolute flex flex-col items-start gap-[52px]" style={{ left: 410, top: 238, width: SLIDE_W }}>
      {/* 라벨 + 대제목 */}
      <div className="flex w-full flex-col gap-6">
        <p className="font-bold text-black" style={{ fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.18px" }}>
          {label}
        </p>
        <p className="font-bold text-black" style={{ fontSize: 32, lineHeight: 1.2, letterSpacing: "-1.6px" }}>
          {title}
        </p>
      </div>

      <div className="flex w-full flex-col gap-[60px]">
        {/* 탭 바 */}
        <div className="flex w-full border-b-2 border-[#f0f0f0]">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="flex h-9 items-start justify-center px-[34px]"
              style={{ borderBottom: "2px solid", borderColor: i === active ? "#000000" : "transparent", marginBottom: -2 }}
            >
              <span
                className="font-extrabold whitespace-nowrap transition-colors"
                style={{ fontSize: 15, lineHeight: 1.1, letterSpacing: "-0.15px", color: i === active ? "#000000" : "#bdbdbd" }}
              >
                {s.tab}
              </span>
            </button>
          ))}
        </div>

        {/* 가로 캐러셀 (탭으로 전환) */}
        <div className="overflow-hidden" style={{ width: SLIDE_W }}>
          <div
            className="flex"
            style={{ gap: GAP, transform: `translateX(${-(SLIDE_W + GAP) * active}px)`, transition: "transform 0.5s ease" }}
          >
            {slides.map((s, i) => (
              <div key={i} className="flex shrink-0 items-center justify-between" style={{ width: SLIDE_W }}>
                {/* 좌측 텍스트 */}
                <div className="flex flex-col justify-between" style={{ width: 405, height: 380 }}>
                  <p className="font-bold text-black" style={{ fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.72px", maxWidth: 320 }}>
                    {s.tab}
                  </p>
                  <div className="flex flex-col gap-5">
                    {s.blocks.map((b, bi) => (
                      <div key={bi} className="flex flex-col gap-3">
                        {b.h && (
                          <p className="font-bold text-black" style={{ fontSize: 16, lineHeight: 1.3, letterSpacing: "-0.48px" }}>
                            {b.h}
                          </p>
                        )}
                        <div className={en ? "" : "whitespace-nowrap"} style={{ fontSize: 15, lineHeight: 1.4, letterSpacing: "-0.45px", color: "#5a5b5d" }}>
                          {b.lines.map((l, li) => (
                            <p key={li}>{l}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 우측 이미지 카드 */}
                <div className="relative shrink-0 overflow-hidden rounded-br-[60px] rounded-tl-[60px]" style={{ width: 680, height: 380 }}>
                  <Image src={s.img} alt="" fill sizes="680px" className={`object-cover ${s.imgPos ?? "object-center"}`} />
                  {s.video && (
                    <button
                      type="button"
                      onClick={() => s.videoUrl && setVideoUrl(s.videoUrl)}
                      className={`absolute inset-0 flex items-center justify-center bg-black/30 ${s.videoUrl ? "cursor-pointer" : "cursor-default"}`}
                      aria-label="영상 재생"
                      disabled={!s.videoUrl}
                    >
                      <svg width="70" height="70" viewBox="0 0 24 24" fill="#ffffff" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {videoUrl && <VideoModal url={videoUrl} onClose={() => setVideoUrl(null)} />}
    </div>
  );
}

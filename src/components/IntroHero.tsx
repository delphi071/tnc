"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/useT";
import Header from "./Header";

/** 인트로(메인 히어로) 슬라이드 — 배경은 풀블리드, 콘텐츠는 코드로 재현.
 *  자막(sub)/CTA 문구는 다국어 사전(intro)에서 슬라이드 순서대로 가져온다. */
const SLIDES = [
  { bg: "/intro/bg-1-v2.jpg", title: "Beyond the Route", scrim: "bg-black/10", href: "/our-way" },
  { bg: "/intro/bg-2.jpg", title: "Same trail New Vision", scrim: "bg-black/40", href: "/same-trail" },
  { bg: "/intro/bg-3-v2.jpg", title: "The Path with Walk", scrim: "bg-black/20", href: "/the-path-we-walk" },
];

/** 화면당 노출 시간(ms) */
const INTERVAL = 3000;
/** 페이드 전환 시간(ms) */
const FADE = 1000;

export default function IntroHero() {
  const t = useT();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      {/* 배경 + 스크림 (크로스페이드) */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.bg}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{ opacity: i === active ? 1 : 0, transitionDuration: `${FADE}ms` }}
        >
          <Image
            src={slide.bg}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className={`absolute inset-0 ${slide.scrim}`} />
        </div>
      ))}

      {/* 헤더 가독성용 상단 그라데이션 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/40 to-transparent" />

      <Header />

      {/* 히어로 콘텐츠 (크로스페이드, max-width 1920 가운데 정렬) */}
      <div className="absolute inset-0 z-20">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.bg}
            className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity ease-in-out ${
              i === active ? "" : "pointer-events-none"
            }`}
            style={{ opacity: i === active ? 1 : 0, transitionDuration: `${FADE}ms` }}
            aria-hidden={i !== active}
          >
            <div className="flex w-full max-w-[1920px] flex-col items-center">
              <h1
                className="font-extrabold leading-[1.1] text-[#0ac200]"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "clamp(2.5rem, 5.2vw, 100px)",
                }}
              >
                {slide.title}
              </h1>
              <p
                className="mt-6 font-extrabold leading-snug text-white"
                style={{ fontSize: "clamp(1rem, 1.25vw, 24px)" }}
              >
                {t.intro.subs[i]}
              </p>
              <Link
                href={slide.href}
                tabIndex={i === active ? 0 : -1}
                className="mt-8 inline-block rounded-tl-[20px] rounded-br-[20px] bg-[#0ac200] px-10 py-[14px] text-[14px] font-bold tracking-[-0.7px] text-black transition-transform hover:scale-[1.03]"
              >
                {t.intro.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 페이지네이션 (현재 슬라이드 하이라이트) */}
      <div className="absolute inset-x-0 bottom-10 z-20 flex justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.bg}
            type="button"
            aria-label={`${i + 1}번째 인트로로 이동`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === active ? "w-7 bg-[#0ac200]" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** 인트로(메인 히어로) 슬라이드 — Figma "00. main-1/2/3" 프레임 */
const SLIDES = [
  { src: "/intro/intro-1.png", alt: "Beyond the Route" },
  { src: "/intro/intro-2.png", alt: "Same trail New Vision" },
  { src: "/intro/intro-3.png", alt: "The Path with Walk" },
];

/** 화면당 노출 시간(ms) */
const INTERVAL = 3000;
/** 페이드 전환 시간(ms) */
const FADE = 1000;

export default function IntroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover transition-opacity ease-in-out"
          style={{
            opacity: i === active ? 1 : 0,
            transitionDuration: `${FADE}ms`,
          }}
        />
      ))}
    </div>
  );
}

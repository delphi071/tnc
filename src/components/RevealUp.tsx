"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** 스크롤로 뷰포트에 들어오면 한 번 "아래 → 위" 로 떠오르며 페이드인 하는 래퍼.
 *  IntersectionObserver 기반이라 PC 의 transform 스테이지 안에서도 실제 화면 진입 시점에 발동한다. */
export default function RevealUp({
  children,
  className = "",
  style,
  distance = 80,
  duration = 700,
  threshold = 0.2,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 시작 시 아래로 내려가 있는 거리(px) */
  distance?: number;
  /** 전환 시간(ms) */
  duration?: number;
  /** 발동 가시 비율 */
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: shown ? "translateY(0)" : `translateY(${distance}px)`,
        opacity: shown ? 1 : 0,
        transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

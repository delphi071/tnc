"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

/** 영상 라이트박스 — 재생 아이콘 클릭 시 iframe 으로 띄운다.
 *  PC 캐러셀은 transform:scale 스테이지 안에 있어 일반 fixed 가 깨지므로
 *  document.body 로 포털해 화면 전체 기준으로 렌더한다.
 *  url 은 임베드 가능한 형태(예: 구글드라이브 .../preview)여야 한다. */
export default function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 sm:bg-black/80 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* 닫기 — 화면 우상단 고정(모바일에서 작은 박스 위에 갇혀 보이지 않도록) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center text-[30px] leading-none text-white"
      >
        ×
      </button>
      <div className="relative aspect-video w-full sm:max-w-[960px]" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={url}
          className="h-full w-full border-0 bg-black sm:rounded-lg"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    </div>,
    document.body,
  );
}

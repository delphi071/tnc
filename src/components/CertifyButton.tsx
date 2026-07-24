/* eslint-disable @next/next/no-img-element */

/** "완보 인증" 탭 제목 옆 CTA 버튼 (Figma 03. 우리가 걷는 길 / Frame 2612959).
 *  배경 없는 텍스트 링크형: route 아이콘 · 라벨 · 외부링크(link-out) 아이콘 모두 초록(#0ac200).
 *  연결할 곳이 아직 정해지지 않아 지금은 클릭해도 동작하지 않는다. */
export default function CertifyButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center justify-center gap-[6px]"
    >
      {/* Figma 는 18×17.28 글리프를 20×20 박스 가운데 놓는다 */}
      <span className="flex size-5 shrink-0 items-center justify-center overflow-clip">
        <img src="/intro/ic-route-green.svg" alt="" width={18} height={17.28} />
      </span>
      {/* 폰트는 상속 — en 은 Montserrat, ko 는 Pretendard (globals.css) */}
      <span
        className="whitespace-nowrap font-bold text-[#0ac200]"
        style={{ fontSize: 14, lineHeight: 1.5, letterSpacing: "-0.7px" }}
      >
        {label}
      </span>
      <img src="/intro/ic-link-out.svg" alt="" width={16} height={16} className="shrink-0" />
    </button>
  );
}

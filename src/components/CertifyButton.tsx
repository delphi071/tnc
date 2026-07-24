/* eslint-disable @next/next/no-img-element */

/** "완보 인증" 탭 제목 옆 CTA 버튼 (Figma 03. 우리가 걷는 길 / Frame 426).
 *  이미지 카드와 같은 대각 라운드(우하·좌상) 언어를 쓰되 반경만 20 으로 줄인 형태.
 *  연결할 곳이 아직 정해지지 않아 지금은 클릭해도 동작하지 않는다. */
export default function CertifyButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center justify-center gap-1 rounded-br-[20px] rounded-tl-[20px] bg-[#0ac200]"
      style={{ paddingLeft: 20, paddingRight: 24, paddingTop: 8, paddingBottom: 8 }}
    >
      {/* Figma 는 16.667×16 글리프를 20×20 박스 가운데 놓는다 */}
      <span className="flex size-5 shrink-0 items-center justify-center">
        <img src="/intro/ic-route-black.svg" alt="" width={16.6667} height={16} />
      </span>
      {/* 폰트는 상속 — en 은 Montserrat, ko 는 Pretendard (globals.css) */}
      <span
        className="whitespace-nowrap font-bold text-black"
        style={{ fontSize: 14, lineHeight: 1.5, letterSpacing: "-0.7px" }}
      >
        {label}
      </span>
    </button>
  );
}

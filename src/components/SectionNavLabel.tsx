import Link from "next/link";

/** 화면 좌/우 가장자리의 섹션 네비 라벨 (스테이지 밖, 고정 픽셀 크기).
 *  sticky 화면 컨테이너의 직속 자식으로 배치 → 1920 스케일과 무관하게 항상 같은 크기.
 *  호버 시 배경↔글자색 반전 + 너비 150→205px(화면 안쪽으로) 확장.
 *  href 가 있으면 링크(다음/이전 섹션 이동), 없으면 호버만 되는 라벨.
 *  z: 덮는 패널보다 낮게(기본 15). reveal 화면이 z<20 인 페이지(우리의 길)는 더 낮게(9) 지정. */
export default function SectionNavLabel({
  side,
  lines,
  href,
  z = 15,
}: {
  side: "left" | "right";
  /** 1~2줄 */
  lines: string[];
  href?: string;
  /** 적층 순서 — 덮는 패널보다 낮아야 콘텐츠에 가려진다 */
  z?: number;
}) {
  const isLeft = side === "left";
  // 모바일(lg 미만)에서는 숨김 — 그 구간은 햄버거 메뉴로 이동. PC(lg+)에서만 노출.
  const boxClass = `group absolute top-1/2 -translate-y-1/2 hidden h-[75px] w-[150px] items-center overflow-hidden bg-black transition-[width,background-color] duration-300 ease-out hover:w-[205px] hover:bg-[#0ac200] lg:flex ${
    isLeft ? "left-0 justify-end pr-5" : "right-0 pl-5"
  }`;
  const inner = (
    <span
      className={`font-bold text-[#0ac200] transition-colors duration-300 ease-out group-hover:text-black ${
        isLeft ? "text-right" : ""
      }`}
      style={{ fontFamily: "var(--font-montserrat)", fontSize: 14, lineHeight: 1.2, letterSpacing: "0.7px" }}
    >
      {lines.map((l, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {l}
        </span>
      ))}
    </span>
  );

  return href ? (
    <Link href={href} className={boxClass} style={{ zIndex: z }}>
      {inner}
    </Link>
  ) : (
    <div className={boxClass} style={{ zIndex: z }}>
      {inner}
    </div>
  );
}

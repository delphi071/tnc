import Link from "next/link";

/** 화면 좌/우 가장자리의 섹션 네비 라벨.
 *  호버 시 배경↔글자색 반전 + 너비 150→205px(화면 안쪽으로) 확장.
 *  href 가 있으면 링크(다음/이전 섹션 이동), 없으면 호버만 되는 라벨.
 *  1920 스테이지 좌표 기준 top:529 에 절대배치되므로 위치 지정 스테이지 안에서 사용. */
export default function SectionNavLabel({
  side,
  lines,
  href,
}: {
  side: "left" | "right";
  /** 1~2줄 */
  lines: string[];
  href?: string;
}) {
  const isLeft = side === "left";
  const boxClass = `group absolute top-[529px] flex h-[75px] w-[150px] items-center overflow-hidden bg-black transition-[width,background-color] duration-300 ease-out hover:w-[205px] hover:bg-[#0ac200] ${
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
    <Link href={href} className={boxClass}>
      {inner}
    </Link>
  ) : (
    <div className={boxClass}>{inner}</div>
  );
}

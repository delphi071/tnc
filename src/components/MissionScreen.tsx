import Image from "next/image";

/** Figma "01. 우리의 길 contents0 > Mission" (1920×1080) */
const STAGE_W = 1920;
const STAGE_H = 1080;
const CIRCLE = 275; // 245 → 약간 키움 (특히 02 텍스트 여유 확보)
const CIRCLE_CY = 737.5; // 원 세로 중심 (디자인 기준 유지)

const CIRCLES = [
  {
    cx: 560.5,
    n: "01",
    lines: ["좋은 길을 찾고", "길에 문화와 이야기를 입혀", "길에 숨을 불어 넣는다."],
  },
  {
    cx: 959.5,
    n: "02",
    lines: ["길위에서", "사람과 지역, 자연을 연결하여", "지속가능한 사회적 가치를 창출한다."],
  },
  {
    cx: 1358.5,
    n: "03",
    lines: ["길을 통해 치유와 배움 등을", "제공하여 창조적 걷기 여행 문화를", "만들고 길의 이용을 활성화한다."],
  },
];

/** 원 사이 "+" 커넥터 중심 x */
const PLUS_X = [760, 1159];

export default function MissionScreen({ scale }: { scale: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <Image src="/intro/bg-1-v2.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/65" />

      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {/* Mission 라벨 */}
        <p
          className="absolute text-center font-bold text-[#0ac200]"
          style={{ left: 0, right: 0, top: 212, fontSize: 24, lineHeight: 1.2, fontFamily: "var(--font-montserrat)" }}
        >
          Mission
        </p>

        {/* 헤드라인 */}
        <div
          className="absolute text-center font-bold text-white"
          style={{ left: 460, right: 460, top: 333, fontSize: 40, lineHeight: 1.2, letterSpacing: "-0.4px" }}
        >
          <p>길 위에서 사람과 지역, 자연을 잇고</p>
          <p>지속가능한 걷기문화를 만듭니다.</p>
        </div>

        {/* 설명 */}
        <div
          className="absolute -translate-y-1/2 text-center text-white/90"
          style={{ left: 0, right: 0, top: 482, fontSize: 18, lineHeight: 1.45, letterSpacing: "-0.36px" }}
        >
          <p>한국의길과문화는 단순히 길을 관리하는 곳이 아니라 이야기와 문화가 숨쉬는 길을 통해 지역경제를 활성화하고,</p>
          <p>생태계를 보전하며, 탐방객에게 치유와 배움을 제공하여 지속 가능한 탐방 문화를 일구겠다는 존재 이유로 설립되었습니다.</p>
        </div>

        {/* 원 3개 */}
        {CIRCLES.map((c) => (
          <div
            key={c.n}
            className="absolute rounded-full bg-[#0ac200]"
            style={{ left: c.cx - CIRCLE / 2, top: CIRCLE_CY - CIRCLE / 2, width: CIRCLE, height: CIRCLE, boxShadow: "0 0 60px rgba(10,194,0,0.35)" }}
          />
        ))}

        {/* 원 안 텍스트 (원 중심 정렬) */}
        {CIRCLES.map((c) => (
          <div
            key={`t-${c.n}`}
            className="absolute flex -translate-x-1/2 flex-col items-center gap-3 text-center text-black"
            style={{ left: c.cx, top: 676 }}
          >
            <p className="font-bold" style={{ fontSize: 24, lineHeight: 1, fontFamily: "var(--font-montserrat)" }}>
              {c.n}
            </p>
            <div style={{ fontSize: 18, lineHeight: 1.5, letterSpacing: "-0.9px" }}>
              {c.lines.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          </div>
        ))}

        {/* "+" 커넥터 */}
        {PLUS_X.map((cx) => (
          <div key={cx} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: cx, top: 745, width: 50, height: 50 }}>
            <div className="absolute left-1/2 -translate-x-1/2 bg-[#d9d9d9] opacity-50" style={{ top: 0, width: 5, height: 50 }} />
            <div className="absolute top-1/2 -translate-y-1/2 bg-[#d9d9d9] opacity-50" style={{ left: 0, width: 50, height: 5 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

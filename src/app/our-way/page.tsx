import type { Metadata } from "next";
import OurWayHero from "@/components/OurWayHero";

export const metadata: Metadata = {
  title: "우리의 길 · 한국의길과문화",
  description: "길, 그 이상의 연결 — 단순한 이동을 넘어, 길 위에 숨겨진 가치를 연결하는 여정이 시작되는 지점",
};

export default function OurWayPage() {
  return <OurWayHero />;
}

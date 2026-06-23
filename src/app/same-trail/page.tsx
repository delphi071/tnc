import type { Metadata } from "next";
import SameTrailHero from "@/components/SameTrailHero";

export const metadata: Metadata = {
  title: "같은 길, 다른 시선 · 한국의길과문화",
  description: "표준을 설계하는 전문성과 현장의 맥락을 읽는 기획력의 결합",
};

export default function SameTrailPage() {
  return <SameTrailHero />;
}

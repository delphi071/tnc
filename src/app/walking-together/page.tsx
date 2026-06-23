import type { Metadata } from "next";
import WalkingTogetherHero from "@/components/WalkingTogetherHero";

export const metadata: Metadata = {
  title: "함께 걷는 사람들 · 한국의길과문화",
  description: "함께 걸어서 아름다운 길, 같이 해서 힘이 되는 길을 걷습니다",
};

export default function WalkingTogetherPage() {
  return <WalkingTogetherHero />;
}

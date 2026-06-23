import type { Metadata } from "next";
import OurStoriesHero from "@/components/OurStoriesHero";

export const metadata: Metadata = {
  title: "알리는 이야기 · 한국의길과문화",
  description: "알리고 나누어 길을 더 풍성하게 합니다.",
};

export default function OurStoriesPage() {
  return <OurStoriesHero />;
}

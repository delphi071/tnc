import type { Metadata } from "next";
import PathWeWalkHero from "@/components/PathWeWalkHero";

export const metadata: Metadata = {
  title: "우리가 걷는 길 · 한국의길과문화",
  description: "길을 내는 마음보다, 길을 지키는 진심으로 길을 보듬습니다.",
};

export default function PathWeWalkPage() {
  return <PathWeWalkHero />;
}

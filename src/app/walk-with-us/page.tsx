import type { Metadata } from "next";
import WalkWithUsHero from "@/components/WalkWithUsHero";

export const metadata: Metadata = {
  title: "마음잇기 · 한국의길과문화",
  description: "길 위에 가치를 더하는 여정에 함께하세요.",
};

export default function WalkWithUsPage() {
  return <WalkWithUsHero />;
}

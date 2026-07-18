import type { Metadata } from "next";
import NoticeDetail from "@/components/NoticeDetail";

export const metadata: Metadata = {
  title: "자료실 · 알리는 이야기 · 한국의길과문화",
  description: "한국의길과문화의 모든 기록을 만나보세요.",
};

/** 자료실 상세 — 동적 라우트. 구성은 공지사항 상세와 동일(NoticeDetail 공유).
 *  현재는 샘플(고정) 콘텐츠를 노출하며, id 기반 실제 데이터는 백엔드 연동 예정. */
export default async function ArchiveDetailPage({ params }: PageProps<"/our-stories/archives/[id]">) {
  await params; // id는 백엔드 연동 시 사용 (샘플 단계에서는 미사용)
  return <NoticeDetail backHash="archives" />;
}

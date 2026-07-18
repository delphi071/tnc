/** 푸터·모바일 메뉴 공용 내비게이션 링크 (헤더 GNB와 동일 경로/순서).
 *  서버·클라이언트 양쪽에서 import 가능하도록 비-client 모듈로 분리. */

/** 대메뉴(컬럼 제목) 링크 — footer.cols 순서와 동일. */
export const COL_HREFS = [
  "/our-way",
  "/same-trail",
  "/the-path-we-walk",
  "/walking-together",
  "/our-stories",
  "/walk-with-us",
];

/** 서브메뉴 링크 — [컬럼index][링크index]. footer.cols[i].links 와 동일 순서/개수.
 *  각 항목을 해당 페이지의 섹션(#해시)으로 연결.
 *  핀-스크롤 페이지는 해시로 섹션 위치까지 스크롤, 탭 페이지는 해시로 탭 활성화. */
export const COL_SUB_HREFS: Record<number, string[]> = {
  0: ["/our-way#mission", "/our-way#vision", "/our-way#history", "/our-way#people", "/our-way#location"],
  1: ["/same-trail#expertise"],
  2: ["/the-path-we-walk#korea", "/the-path-we-walk#regional", "/the-path-we-walk#culture", "/the-path-we-walk#goods"],
  3: ["/walking-together#kta", "/walking-together#atn", "/walking-together#wtn", "/walking-together#gko"],
  4: ["/our-stories#notices", "/our-stories#subscribe", "/our-stories#activities", "/our-stories#archives", "/our-stories#contact"],
  5: ["/walk-with-us#donation", "/walk-with-us#annual"],
};

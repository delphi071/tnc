"use client";

import { getDictionary, type Dictionary } from "./dictionaries";
import { useLocale } from "./LocaleProvider";

/** 현재 언어의 사전을 반환. 토글 시 useLocale 구독으로 자동 리렌더된다.
 *  예) const t = useT(); t.header.nav.ourStories */
export function useT(): Dictionary {
  const { locale } = useLocale();
  return getDictionary(locale);
}

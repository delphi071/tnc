/** 서버·클라이언트 양쪽에서 import하는 i18n 상수/타입.
 *  ("use client" 모듈에서 export하면 서버 컴포넌트에서 값이 undefined가 되므로 분리) */
export type Locale = "ko" | "en";

export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "ko";

export function normalizeLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

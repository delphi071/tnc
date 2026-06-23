"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "./config";

/** 다국어(한국어/영어) 토글 상태. URL은 바꾸지 않고 쿠키에 저장한다.
 *  초기값은 루트 레이아웃이 서버에서 쿠키를 읽어 내려주므로 첫 렌더 깜빡임이 없다.
 *  상수/타입은 서버에서도 쓰므로 ./config(비-client)에서 가져온다. */
export type { Locale } from "./config";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    // 1년 유지. 미들웨어 없이 클라이언트 쿠키만으로 다음 방문 시 언어 복원
    document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(
    () => setLocale(locale === "ko" ? "en" : "ko"),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
  return ctx;
}

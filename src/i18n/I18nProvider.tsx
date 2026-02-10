'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale, getMessage, type Locale } from './messages';

type I18nContextValue = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({
  locale,
  children
}: {
  locale: Locale;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale ?? defaultLocale);

  const t = useCallback((key: string) => getMessage(currentLocale, key), [currentLocale]);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === currentLocale) return;
      setCurrentLocale(nextLocale);
      document.cookie = `task_app_locale=${nextLocale}; path=/; max-age=31536000`;
      router.refresh();
    },
    [currentLocale, router]
  );

  const value = useMemo(
    () => ({ locale: currentLocale, t, setLocale }),
    [currentLocale, t, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      locale: defaultLocale,
      t: (key: string) => getMessage(defaultLocale, key),
      setLocale: () => {}
    } as I18nContextValue;
  }
  return context;
};

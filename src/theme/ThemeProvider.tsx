'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemTheme = (): ThemeMode => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({
  initialTheme,
  children
}: {
  initialTheme?: ThemeMode | null;
  children: React.ReactNode;
}) => {
  const [hasUserPreference, setHasUserPreference] = useState(Boolean(initialTheme));
  const [theme, setThemeState] = useState<ThemeMode>(() => initialTheme ?? getSystemTheme());

  useEffect(() => {
    if (hasUserPreference) {
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      document.cookie = `task_app_theme=${theme}; path=/; max-age=31536000`;
      return;
    }
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.removeProperty('color-scheme');
  }, [hasUserPreference, theme]);

  useEffect(() => {
    if (hasUserPreference || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setThemeState(media.matches ? 'dark' : 'light');
    handler();
    if (media.addEventListener) {
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
    media.addListener(handler);
    return () => media.removeListener(handler);
  }, [hasUserPreference]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setHasUserPreference(true);
    setThemeState(nextTheme);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: getSystemTheme(),
      setTheme: () => {}
    } as ThemeContextValue;
  }
  return context;
};

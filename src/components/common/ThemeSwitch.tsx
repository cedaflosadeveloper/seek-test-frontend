'use client';

import { useTheme } from '@/theme/ThemeProvider';
import { useI18n } from '@/i18n/I18nProvider';

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  return (
    <div className="menu-switch" role="group" aria-label={t('theme.label')}>
      <button
        type="button"
        className={`menu-switch-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
      >
        {t('theme.light')}
      </button>
      <button
        type="button"
        className={`menu-switch-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
      >
        {t('theme.dark')}
      </button>
    </div>
  );
};

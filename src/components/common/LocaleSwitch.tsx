'use client';

import { useI18n } from '@/i18n/I18nProvider';

export const LocaleSwitch = () => {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="menu-switch" aria-label={t('common.language')}>
      <button
        type="button"
        className={`menu-switch-btn ${locale === 'es' ? 'active' : ''}`}
        onClick={() => setLocale('es')}
        aria-pressed={locale === 'es'}
      >
        ES
      </button>
      <button
        type="button"
        className={`menu-switch-btn ${locale === 'en' ? 'active' : ''}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
};

'use client';

import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useI18n } from '@/i18n/I18nProvider';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppShell title={t('tasksError.title')} subtitle={t('tasksError.subtitle')}>
      <section className="card">
        <p className="muted">{t('tasksError.message')}</p>
        <button className="primary" type="button" onClick={() => reset()}>
          {t('common.retry')}
        </button>
      </section>
    </AppShell>
  );
}

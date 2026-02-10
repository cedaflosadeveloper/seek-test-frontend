'use client';

import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppShell
      title={t('taskError.title')}
      leftSlot={
        <Link className="icon-button" href="/tasks" aria-label={t('common.backToList')}>
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
      }
    >
      <section className="card">
        <p className="muted">{t('taskError.message')}</p>
        <button className="primary" type="button" onClick={() => reset()}>
          {t('common.retry')}
        </button>
      </section>
    </AppShell>
  );
}

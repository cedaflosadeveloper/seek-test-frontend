import { AppShell } from '@/components/layout/AppShell';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerI18n } from '@/i18n/server';

export default async function NotFound() {
  const { t } = await getServerI18n();
  return (
    <AppShell
      title={t('taskNotFound.title')}
      leftSlot={
        <Link className="icon-button" href="/tasks" aria-label={t('common.backToList')}>
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
      }
    >
      <section className="card">
        <p className="muted">{t('taskNotFound.message')}</p>
      </section>
    </AppShell>
  );
}

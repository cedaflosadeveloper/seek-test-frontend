import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { getServerI18n } from '@/i18n/server';

export default async function NotFound() {
  const { t } = await getServerI18n();
  return (
    <AppShell title={t('notFound.title')} subtitle={t('notFound.subtitle')}>
      <section className="card">
        <p className="muted">{t('notFound.message')}</p>
        <div className="form-actions">
          <Link className="primary" href="/login">
            {t('notFound.goHome')}
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

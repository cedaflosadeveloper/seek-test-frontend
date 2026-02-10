import { AppShell } from '@/components/layout/AppShell';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerI18n } from '@/i18n/server';

export default async function Loading() {
  const { t } = await getServerI18n();
  return (
    <AppShell
      title={t('taskEdit.title')}
      leftSlot={
        <Link className="icon-button" href="/tasks" aria-label={t('common.backToList')}>
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
      }
    >
      <section className="card form-card">
        <div className="form-row">
          <div className="form-row-header">
            <div className="skeleton skeleton-line title" />
            <span className="skeleton skeleton-circle" />
          </div>
          <div className="skeleton skeleton-line" />
        </div>
        <div className="form-row">
          <div className="skeleton skeleton-line title" />
          <div className="skeleton skeleton-line" style={{ height: '84px' }} />
        </div>
        <div className="form-row">
          <div className="skeleton skeleton-line title" />
          <div className="skeleton skeleton-line" />
        </div>
        <div className="form-actions">
          <span className="skeleton skeleton-line" style={{ width: '140px', height: '40px' }} />
        </div>
      </section>
    </AppShell>
  );
}

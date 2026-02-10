import { AppShell } from '@/components/layout/AppShell';
import { getServerI18n } from '@/i18n/server';

export default async function Loading() {
  const { t } = await getServerI18n();
  return (
    <AppShell title={t('tasks.title')}>
      <section className="card">
        <div className="task-grid">
          {[1, 2, 3].map((item) => (
            <article key={item} className="task-card skeleton">
              <div className="task-header">
                <div className="skeleton skeleton-line title" />
                <span className="skeleton skeleton-pill" />
              </div>
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line" style={{ width: '75%' }} />
              <div className="task-meta">
                <div className="skeleton-actions">
                  <span className="skeleton skeleton-circle" />
                  <span className="skeleton skeleton-circle" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

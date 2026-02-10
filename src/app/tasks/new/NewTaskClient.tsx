'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { TaskForm } from '@/components/tasks/TaskForm';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import { useTaskStore } from '@/state/taskStore';
import { useI18n } from '@/i18n/I18nProvider';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createTaskAction } from '../actions';

export const NewTaskClient = () => {
  const router = useRouter();
  const { status } = useTaskStore();
  const { t } = useI18n();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [pendingData, setPendingData] = useState<{
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
  } | null>(null);

  const handleCreate = async (data: { title: string; description: string; status: 'todo' | 'in_progress' | 'done' }) => {
    try {
      await createTaskAction({ title: data.title, description: data.description, status: data.status });
      window.sessionStorage.setItem('task_toast', t('tasks.actionSuccess'));
      router.push('/tasks');
    } catch {
      setToast({ message: t('tasks.actionError'), type: 'error' });
      window.setTimeout(() => setToast(null), 2000);
    }
  };

  const handleConfirmSave = async (data: { title: string; description: string; status: 'todo' | 'in_progress' | 'done' }) => {
    setPendingData(data);
  };

  return (
    <AppShell
      title={t('taskNew.title')}
      leftSlot={
        <Link className="icon-button" href="/tasks" aria-label={t('common.backToList')}>
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
      }
    >
      <TaskForm mode="create" onSubmit={handleConfirmSave} isLoading={status === 'loading'} resetOnSubmit={false} />
      {toast ? (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          <span>{toast.message}</span>
          <button className="toast-close" type="button" onClick={() => setToast(null)} aria-label={t('common.close')}>
            ×
          </button>
        </div>
      ) : null}
      <DeleteConfirmModal
        title=""
        isOpen={Boolean(pendingData)}
        onCancel={() => setPendingData(null)}
        onConfirm={async () => {
          if (!pendingData) return;
          await handleCreate(pendingData);
          setPendingData(null);
        }}
        message={t('taskNew.confirmSave')}
        confirmLabel={t('common.yes')}
      />
    </AppShell>
  );
};

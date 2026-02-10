'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTaskStore } from '@/state/taskStore';
import { deleteTaskAction, updateTaskAction } from '../actions';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import { useI18n } from '@/i18n/I18nProvider';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Task } from '@/core/domain/task';

type TaskEditClientProps = {
  initialTask: Task | null;
  userEmail?: string | null;
};

export const TaskEditClient = ({ initialTask, userEmail }: TaskEditClientProps) => {
  const router = useRouter();
  const { status } = useTaskStore();
  const { t } = useI18n();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);
  const [pendingData, setPendingData] = useState<{ title: string; description: string; status: 'todo' | 'in_progress' | 'done' } | null>(null);

  const handleSave = async (data: { title: string; description: string; status: 'todo' | 'in_progress' | 'done' }) => {
    if (!initialTask) return;
    try {
      await updateTaskAction(initialTask.id, {
        title: data.title,
        description: data.description,
        status: data.status
      });
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
      title={t('taskEdit.title')}
      menuUser={userEmail}
      leftSlot={
        <Link className="icon-button" href="/tasks" aria-label={t('common.backToList')}>
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
      }
    >
      {!initialTask ? (
        <section className="card">
          <p className="muted">{t('taskEdit.notFound')}</p>
        </section>
      ) : (
        <TaskForm
          mode="edit"
          initialTitle={initialTask.title}
          initialDescription={initialTask.description}
          initialStatus={initialTask.status}
          onSubmit={handleConfirmSave}
          isLoading={status === 'loading'}
          resetOnSubmit={false}
          onDelete={() => setTaskToDelete({ id: initialTask.id, title: initialTask.title })}
        />
      )}
      {toast ? (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          <span>{toast.message}</span>
          <button className="toast-close" type="button" onClick={() => setToast(null)} aria-label={t('common.close')}>
            ×
          </button>
        </div>
      ) : null}
      <DeleteConfirmModal
        title={taskToDelete?.title ?? ''}
        isOpen={Boolean(taskToDelete)}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={async () => {
          if (!taskToDelete) return;
          try {
            await deleteTaskAction(taskToDelete.id);
            setTaskToDelete(null);
            window.sessionStorage.setItem('task_toast', t('tasks.actionSuccess'));
            router.push('/tasks');
          } catch {
            setToast({ message: t('tasks.actionError'), type: 'error' });
            window.setTimeout(() => setToast(null), 2000);
          }
        }}
        message={t('tasks.deleteConfirm')}
      />
      <DeleteConfirmModal
        title=""
        isOpen={Boolean(pendingData)}
        onCancel={() => setPendingData(null)}
        onConfirm={async () => {
          if (!pendingData) return;
          await handleSave(pendingData);
          setPendingData(null);
        }}
        message={t('taskEdit.confirmSave')}
        confirmLabel={t('common.yes')}
      />
    </AppShell>
  );
};

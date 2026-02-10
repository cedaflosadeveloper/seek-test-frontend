'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { TaskList } from '@/components/tasks/TaskList';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import { useAuthStore } from '@/state/authStore';
import { useTaskStore } from '@/state/taskStore';
import { useI18n } from '@/i18n/I18nProvider';
import { deleteTaskAction } from './actions';
import type { Task } from '@/core/domain/task';
import { LogOut, Plus } from 'lucide-react';

type TasksClientProps = {
  initialTasks: Task[];
  initialUserEmail?: string | null;
};

export const TasksClient = ({ initialTasks, initialUserEmail }: TasksClientProps) => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { tasks, status, error, setTasks } = useTaskStore();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { t } = useI18n();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    const stored = window.sessionStorage.getItem('task_toast');
    if (stored) {
      showToast(stored, 'success');
      window.sessionStorage.removeItem('task_toast');
    }
  }, []);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks, setTasks]);

  return (
    <AppShell
      title={t('tasks.title')}
      subtitle={t('tasks.subtitle')}
      menuUser={initialUserEmail}
      menuActions={
        <button className="menu-item danger" type="button" onClick={() => setConfirmLogout(true)}>
          <LogOut size={16} aria-hidden="true" />
          {t('tasks.logout')}
        </button>
      }
    >
      <div className="list-toolbar">
        <Link className="primary create-button" href="/tasks/new" aria-label={t('tasks.createAria')}>
          {t('tasks.create')}
          <Plus size={18} aria-hidden="true" />
        </Link>
      </div>
      <section className="card">
        {error ? <p className="error">{error}</p> : null}
        <TaskList tasks={tasks} isLoading={status === 'loading'} onDeleteRequest={setTaskToDelete} />
      </section>
      <DeleteConfirmModal
        title={taskToDelete?.title ?? ''}
        isOpen={Boolean(taskToDelete)}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={async () => {
          if (!taskToDelete) return;
          try {
            await deleteTaskAction(taskToDelete.id);
            setTaskToDelete(null);
            router.refresh();
            showToast(t('tasks.actionSuccess'), 'success');
          } catch {
            showToast(t('tasks.actionError'), 'error');
          }
        }}
        message={t('tasks.deleteConfirm')}
      />
      <DeleteConfirmModal
        title={initialUserEmail ? <strong>{initialUserEmail}</strong> : ''}
        isOpen={confirmLogout}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          logout();
          setConfirmLogout(false);
          router.replace('/login');
        }}
        message={t('tasks.logoutConfirm')}
        confirmLabel={t('common.yes')}
      />
      {toast ? (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          <span>{toast.message}</span>
          <button className="toast-close" type="button" onClick={() => setToast(null)} aria-label={t('common.close')}>
            ×
          </button>
        </div>
      ) : null}
    </AppShell>
  );
};

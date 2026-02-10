import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getTaskById } from '@/infra/server/tasksServerApi';
import { TaskEditClient } from './TaskEditClient';
import type { Task } from '@/core/domain/task';
import { getServerI18n } from '@/i18n/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { t } = await getServerI18n();
  const appTitle = t('meta.appTitle');
  const cookieStore = await cookies();
  const token = cookieStore.get('task_app_token')?.value;
  const { id } = await params;

  if (!token) {
    return {
      title: `${t('meta.editTaskTitle')} | ${appTitle}`
    };
  }

  try {
    const task = await getTaskById(token, id);
    return {
      title: `${t('meta.editTaskTitle')}: ${task.title} | ${appTitle}`,
      description: task.description || t('meta.editTaskDescription')
    };
  } catch {
    return {
      title: `${t('meta.taskNotFoundTitle')} | ${appTitle}`
    };
  }
}

export default async function EditTaskPage({ params }: Params) {
  const cookieStore = await cookies();
  const token = cookieStore.get('task_app_token')?.value;
  if (!token) redirect('/login');

  const userEmail = cookieStore.get('task_app_user')?.value ?? null;
  const { id } = await params;

  let task: Task | null = null;
  try {
    task = await getTaskById(token, id);
  } catch {
    task = null;
  }

  if (!task) {
    notFound();
  }

  return <TaskEditClient initialTask={task} userEmail={userEmail} />;
}

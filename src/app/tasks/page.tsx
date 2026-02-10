import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { TasksClient } from './TasksClient';
import { getTasks } from '@/infra/server/tasksServerApi';
import type { Task } from '@/core/domain/task';
import { getServerI18n } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  const appTitle = t('meta.appTitle');
  return {
    title: `${t('meta.tasksTitle')} | ${appTitle}`,
    description: t('meta.tasksDescription')
  };
}

export default async function TasksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('task_app_token')?.value;
  if (!token) redirect('/login');

  const userEmail = cookieStore.get('task_app_user')?.value ?? null;

  let tasks: Task[] = [];
  try {
    tasks = await getTasks(token);
  } catch {
    tasks = [];
  }

  return <TasksClient initialTasks={tasks} initialUserEmail={userEmail} />;
}

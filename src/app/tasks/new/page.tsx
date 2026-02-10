import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NewTaskClient } from './NewTaskClient';
import { getServerI18n } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  const appTitle = t('meta.appTitle');
  return {
    title: `${t('meta.newTaskTitle')} | ${appTitle}`,
    description: t('meta.newTaskDescription')
  };
}

export default async function NewTaskPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('task_app_token')?.value;
  if (!token) redirect('/login');
  const userEmail = cookieStore.get('task_app_user')?.value ?? null;
  return <NewTaskClient userEmail={userEmail} />;
}

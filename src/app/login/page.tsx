import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { getServerI18n } from '@/i18n/server';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('task_app_token')?.value;
  if (token) {
    redirect('/tasks');
  }
  const { t } = await getServerI18n();

  return (
    <AppShell title={t('login.title')}>
      <LoginForm />
    </AppShell>
  );
}

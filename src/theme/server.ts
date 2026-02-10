import { cookies } from 'next/headers';
import type { ThemeMode } from './ThemeProvider';

export const getServerTheme = async (): Promise<ThemeMode | null> => {
  const cookieStore = await cookies();
  const value = cookieStore.get('task_app_theme')?.value;
  if (value === 'light' || value === 'dark') return value;
  return null;
};

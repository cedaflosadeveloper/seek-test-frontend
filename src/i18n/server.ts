import { cookies, headers } from 'next/headers';
import { defaultLocale, getMessage, isLocale, type Locale } from './messages';

const detectLocaleFromHeader = (value: string | null): Locale => {
  if (!value) return defaultLocale;
  const lower = value.toLowerCase();
  if (lower.startsWith('en') || lower.includes('en-')) return 'en';
  if (lower.startsWith('es') || lower.includes('es-')) return 'es';
  return defaultLocale;
};

export const getServerLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get('task_app_locale')?.value;
  if (isLocale(fromCookie)) return fromCookie;

  const headerStore = await headers();
  return detectLocaleFromHeader(headerStore.get('accept-language'));
};

export const getServerI18n = async () => {
  const locale = await getServerLocale();
  const t = (key: string) => getMessage(locale, key);
  return { locale, t };
};

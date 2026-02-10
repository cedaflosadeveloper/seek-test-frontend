import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.scss';
import { I18nProvider } from '@/i18n/I18nProvider';
import { getServerI18n, getServerLocale } from '@/i18n/server';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { getServerTheme } from '@/theme/server';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans'
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t('meta.appTitle'),
    description: t('meta.appDescription'),
    icons: {
      icon: '/favicon.svg'
    }
  };
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();
  const theme = await getServerTheme();
  return (
    <html lang={locale} data-theme={theme ?? undefined}>
      <body className={spaceGrotesk.variable}>
        <I18nProvider locale={locale}>
          <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

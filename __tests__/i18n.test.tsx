import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider, useI18n } from '@/i18n/I18nProvider';
import { LocaleSwitch } from '@/components/common/LocaleSwitch';
import { defaultLocale, getMessage, isLocale, messages } from '@/i18n/messages';
import { getServerI18n, getServerLocale } from '@/i18n/server';

const refreshMock = jest.fn();
let cookieMap = new Map<string, string>();
let headerValue: string | null = null;

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock })
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({
    get: (key: string) => {
      const value = cookieMap.get(key);
      return value ? { value } : undefined;
    }
  })),
  headers: jest.fn(async () => ({
    get: (key: string) => (key.toLowerCase() === 'accept-language' ? headerValue : null)
  }))
}));

const TestComponent = () => {
  const { locale, t, setLocale } = useI18n();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="label">{t('tasks.title')}</span>
      <button type="button" onClick={() => setLocale('en')}>
        switch
      </button>
    </div>
  );
};

const FallbackComponent = () => {
  const { locale, t, setLocale } = useI18n();
  useEffect(() => {
    setLocale('en');
  }, [setLocale]);
  return <span>{`${locale}:${t('tasks.title')}`}</span>;
};

describe('i18n', () => {
  beforeEach(() => {
    refreshMock.mockClear();
    cookieMap = new Map();
    headerValue = null;
    document.cookie = 'task_app_locale=; Max-Age=0; path=/';
  });

  it('returns translations and falls back when needed', () => {
    expect(isLocale('es')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(defaultLocale).toBe('es');

    const original = (messages as any).es.onlyEs;
    (messages as any).es.onlyEs = { value: 'Solo' };
    try {
      expect(getMessage('en', 'onlyEs.value')).toBe('Solo');
    } finally {
      if (original === undefined) {
        delete (messages as any).es.onlyEs;
      } else {
        (messages as any).es.onlyEs = original;
      }
    }

    expect(getMessage('en', 'missing.key')).toBe('missing.key');
  });

  it('provides locale and updates via provider', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider locale={undefined as unknown as 'es'}>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('es');
    expect(screen.getByTestId('label')).toHaveTextContent('Tareas');

    await user.click(screen.getByRole('button', { name: 'switch' }));
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(screen.getByTestId('label')).toHaveTextContent('Tasks');
    expect(document.cookie).toContain('task_app_locale=en');
    expect(refreshMock).toHaveBeenCalled();
  });

  it('handles locale switch and ignores same locale', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider locale="es">
        <LocaleSwitch />
      </I18nProvider>
    );

    await user.click(screen.getByRole('button', { name: 'ES' }));
    expect(refreshMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'EN' }));
    expect(refreshMock).toHaveBeenCalled();
  });

  it('uses fallback context when no provider exists', () => {
    render(<FallbackComponent />);
    expect(screen.getByText('es:Tareas')).toBeInTheDocument();
  });

  it('reads locale from cookie or header on server', async () => {
    cookieMap.set('task_app_locale', 'en');
    headerValue = 'es-ES,es;q=0.9';
    expect(await getServerLocale()).toBe('en');

    cookieMap.clear();
    headerValue = 'en-US,en;q=0.8';
    expect(await getServerLocale()).toBe('en');

    headerValue = 'es-PE,es;q=0.8';
    expect(await getServerLocale()).toBe('es');

    headerValue = 'fr-FR';
    expect(await getServerLocale()).toBe('es');

    headerValue = null;
    expect(await getServerLocale()).toBe('es');
  });

  it('returns server i18n helper', async () => {
    cookieMap.set('task_app_locale', 'en');
    const { locale, t } = await getServerI18n();
    expect(locale).toBe('en');
    expect(t('tasks.title')).toBe('Tasks');
  });
});

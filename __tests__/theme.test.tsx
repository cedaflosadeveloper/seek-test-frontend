import { useEffect } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { ThemeSwitch } from '@/components/common/ThemeSwitch';
import { HeaderMenu } from '@/components/common/HeaderMenu';
import { I18nProvider } from '@/i18n/I18nProvider';
import { getServerTheme } from '@/theme/server';

let cookieMap = new Map<string, string>();

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({
    get: (key: string) => {
      const value = cookieMap.get(key);
      return value ? { value } : undefined;
    }
  }))
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() })
}));

const setMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn()
    }))
  });
};

const ThemeConsumer = () => {
  const { theme } = useTheme();
  return <span>{theme}</span>;
};

const ThemeFallbackConsumer = () => {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);
  return <span>{theme}</span>;
};

describe('theme', () => {
  beforeEach(() => {
    cookieMap = new Map();
    document.documentElement.removeAttribute('data-theme');
    document.cookie = 'task_app_theme=; Max-Age=0; path=/';
    setMatchMedia(false);
  });

  it('uses system theme when no preference exists', () => {
    setMatchMedia(true);
    render(
      <ThemeProvider initialTheme={null}>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByText('dark')).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it('applies user theme and updates cookie', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider initialTheme="dark">
        <ThemeSwitch />
      </ThemeProvider>
    );

    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'));
    await user.click(screen.getByRole('button', { name: 'Claro' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.cookie).toContain('task_app_theme=light');
    await user.click(screen.getByRole('button', { name: 'Oscuro' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('falls back to system theme without provider', () => {
    setMatchMedia(false);
    render(<ThemeFallbackConsumer />);
    expect(screen.getByText('light')).toBeInTheDocument();
  });

  it('falls back to light when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined
    });
    render(<ThemeFallbackConsumer />);
    expect(screen.getByText('light')).toBeInTheDocument();
  });

  it('tracks system theme changes without preference', async () => {
    let listener: (() => void) | undefined;
    const media = {
      matches: true,
      addEventListener: jest.fn((_event: string, cb: () => void) => {
        listener = cb;
      }),
      removeEventListener: jest.fn()
    };
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue(media)
    });

    render(
      <ThemeProvider initialTheme={null}>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByText('dark')).toBeInTheDocument();
    media.matches = false;
    act(() => {
      listener?.();
    });
    await waitFor(() => expect(screen.getByText('light')).toBeInTheDocument());
  });

  it('supports legacy matchMedia listeners', () => {
    const media = {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn()
    };
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue(media)
    });

    render(
      <ThemeProvider initialTheme={null}>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(media.addListener).toHaveBeenCalled();
  });

  it('renders header menu with toggles and actions', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider locale="es">
        <ThemeProvider initialTheme="light">
          <HeaderMenu actions={<button type="button">Salir</button>} user="user1" />
        </ThemeProvider>
      </I18nProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Menú' }));
    expect(screen.getByText('Usuario logueado:')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('Idioma')).toBeInTheDocument();
    expect(screen.getByText('Tema')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();

    await user.click(screen.getByText('Idioma'));
    expect(screen.getByText('Tema')).toBeInTheDocument();

    await user.click(screen.getByText('Salir'));
    await waitFor(() => {
      expect(screen.queryByText('Idioma')).not.toBeInTheDocument();
    });
  });

  it('renders header menu without actions', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider locale="es">
        <ThemeProvider initialTheme="light">
          <HeaderMenu user="user2" />
        </ThemeProvider>
      </I18nProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Menú' }));
    expect(screen.getByText('Usuario logueado:')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('Idioma')).toBeInTheDocument();
    expect(screen.getByText('Tema')).toBeInTheDocument();
    expect(screen.queryByText('Salir')).not.toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Idioma')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Menú' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByText('Idioma')).not.toBeInTheDocument();
    });
  });

  it('reads theme from cookie on server', async () => {
    cookieMap.set('task_app_theme', 'dark');
    expect(await getServerTheme()).toBe('dark');
    cookieMap.set('task_app_theme', 'unknown');
    expect(await getServerTheme()).toBeNull();
  });
});

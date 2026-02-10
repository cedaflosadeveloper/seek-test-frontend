import 'client-only';

const TOKEN_KEY = 'task_app_token';
const USER_KEY = 'task_app_user';

const setCookie = (key: string, value: string) => {
  /* istanbul ignore next */
  if (typeof document === 'undefined') return;
  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=86400`;
};

const getCookie = (key: string) => {
  /* istanbul ignore next */
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${key}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const clearCookie = (key: string) => {
  /* istanbul ignore next */
  if (typeof document === 'undefined') return;
  document.cookie = `${key}=; path=/; max-age=0`;
};

export const tokenStorage = {
  get(): string | null {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return null;
    // El token es httpOnly en el server; el cliente no debe leerlo.
    return null;
  },
  set(token: string) {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return;
    void token;
  },
  getUser(): string | null {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(USER_KEY) ?? getCookie(USER_KEY);
  },
  setUser(email: string) {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(USER_KEY, email);
    setCookie(USER_KEY, email);
  },
  clear() {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    clearCookie(TOKEN_KEY);
    clearCookie(USER_KEY);
  }
};

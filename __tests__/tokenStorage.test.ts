import { tokenStorage } from '@/infra/storage/tokenStorage';

describe('tokenStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.cookie = 'task_app_token=; max-age=0; path=/';
    document.cookie = 'task_app_user=; max-age=0; path=/';
  });

  it('stores user and does not expose token', () => {
    tokenStorage.set('jwt');
    tokenStorage.setUser('user@mail.com');
    expect(tokenStorage.get()).toBeNull();
    expect(tokenStorage.getUser()).toBe('user@mail.com');
    expect(document.cookie).toContain('task_app_user=');
  });

  it('falls back to cookie when localStorage is empty', () => {
    document.cookie = 'task_app_token=cookie.jwt; path=/';
    document.cookie = 'task_app_user=cookie@user; path=/';
    expect(tokenStorage.get()).toBeNull();
    expect(tokenStorage.getUser()).toBe('cookie@user');
  });

  it('returns null when no cookie exists', () => {
    expect(tokenStorage.get()).toBeNull();
    expect(tokenStorage.getUser()).toBeNull();
  });

  it('clears token and user', () => {
    tokenStorage.set('jwt');
    tokenStorage.setUser('user@mail.com');
    tokenStorage.clear();
    expect(tokenStorage.get()).toBeNull();
    expect(tokenStorage.getUser()).toBeNull();
  });

  it('returns null when window or document are undefined', () => {
    const originalWindow = (global as any).window;
    const originalDocument = (global as any).document;
    (global as any).window = undefined;
    (global as any).document = undefined;

    expect(tokenStorage.get()).toBeNull();
    expect(tokenStorage.getUser()).toBeNull();
    tokenStorage.set('jwt');
    tokenStorage.setUser('user@mail.com');
    tokenStorage.clear();

    (global as any).window = originalWindow;
    (global as any).document = originalDocument;
  });

});

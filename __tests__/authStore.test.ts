import { useAuthStore } from '@/state/authStore';
import { container } from '@/infra/container';
import { loginAction, logoutAction } from '@/app/login/actions';

jest.mock('@/app/login/actions', () => ({
  loginAction: jest.fn(),
  logoutAction: jest.fn()
}));

beforeEach(() => {
  window.localStorage.clear();
  useAuthStore.setState({ userEmail: null, status: 'idle', error: null });
});

describe('auth store', () => {
  it('logs in and stores user', async () => {
    (loginAction as jest.Mock).mockResolvedValue({ userEmail: 'user@mail.com' });

    await useAuthStore.getState().login('user@mail.com', 'pass');
    expect(useAuthStore.getState().userEmail).toBe('user@mail.com');
    expect(window.localStorage.getItem('task_app_user')).toBe('user@mail.com');
  });

  it('fails on invalid credentials', async () => {
    (loginAction as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });
    await useAuthStore.getState().login('user', 'wrong');
    expect(useAuthStore.getState().error).toBe('Invalid credentials');
  });

  it('logs out', () => {
    window.localStorage.setItem('task_app_user', 'user');
    useAuthStore.setState({ userEmail: 'user', status: 'idle', error: null });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().userEmail).toBeNull();
    expect(window.localStorage.getItem('task_app_user')).toBeNull();
    expect(logoutAction).toHaveBeenCalled();
  });

  it('hydrates from storage', () => {
    window.localStorage.setItem('task_app_user', 'user');
    useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().userEmail).toBe('user');
  });

  it('sets generic error when non-error is thrown', async () => {
    const spy = jest.spyOn(container.authRepo, 'login').mockRejectedValue('boom');
    useAuthStore.setState({ userEmail: null, status: 'idle', error: null });
    await useAuthStore.getState().login('u', 'p');
    expect(useAuthStore.getState().error).toBe('Error inesperado');
    spy.mockRestore();
  });
});

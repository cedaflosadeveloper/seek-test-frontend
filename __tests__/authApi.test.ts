import { authApi } from '@/infra/api/authApi';
import { loginAction } from '@/app/login/actions';

jest.mock('@/app/login/actions', () => ({
  loginAction: jest.fn()
}));

describe('auth api', () => {
  it('returns user email for valid credentials', async () => {
    (loginAction as jest.Mock).mockResolvedValue({ userEmail: 'user@mail.com' });

    const result = await authApi.login({ username: 'user@mail.com', password: 'pass' });
    expect(result.userEmail).toBe('user@mail.com');
    expect(loginAction).toHaveBeenCalledWith({ username: 'user@mail.com', password: 'pass' });
  });

  it('throws on invalid credentials', async () => {
    (loginAction as jest.Mock).mockRejectedValue(new Error('Credenciales invalidas'));
    await expect(authApi.login({ username: 'x', password: 'y' })).rejects.toThrow(
      'Credenciales invalidas'
    );
  });
});

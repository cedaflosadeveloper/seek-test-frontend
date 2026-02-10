import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthStore } from '@/state/authStore';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock })
}));

jest.mock('@/state/authStore', () => {
  const login = jest.fn();
  const useAuthStoreMock = jest.fn(() => ({
    login,
    status: 'idle',
    error: null
  }));
  (useAuthStoreMock as any).getState = () => ({ error: null });
  return { useAuthStore: useAuthStoreMock };
});

const defaultUseAuthStoreImpl = (useAuthStore as any).getMockImplementation();

describe('LoginForm', () => {
  beforeEach(() => {
    (useAuthStore as any).mockImplementation(defaultUseAuthStoreImpl);
    (useAuthStore as any).getState = () => ({ error: null });
    const loginMock = (useAuthStore as any)().login;
    loginMock.mockClear();
    loginMock.mockResolvedValue(undefined);
    pushMock.mockClear();
  });

  it('disables submit when empty and enables when filled', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const button = screen.getByRole('button', { name: 'Ingresar' });
    expect(button).toBeDisabled();

    await user.type(screen.getByLabelText(/Usuario/i), 'user');
    await user.type(screen.getByLabelText(/Contraseñ?a/i), 'pass');
    expect(button).toBeEnabled();
  });

  it('submits and navigates on success', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/Usuario/i), 'user');
    await user.type(screen.getByLabelText(/Contraseñ?a/i), 'pass');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect((useAuthStore as any)().login).toHaveBeenCalledWith('user', 'pass');
    expect(pushMock).toHaveBeenCalledWith('/tasks');
  });

  it('renders error message when present', () => {
    const previousImpl = (useAuthStore as any).getMockImplementation();
    (useAuthStore as any).mockImplementation(() => ({
      login: jest.fn(),
      status: 'idle',
      error: 'Credenciales invalidas'
    }));
    render(<LoginForm />);
    expect(screen.getByText('Credenciales invalidas')).toBeInTheDocument();
    (useAuthStore as any).mockImplementation(previousImpl);
  });

  it('shows available users on invalid credentials', () => {
    const previousImpl = (useAuthStore as any).getMockImplementation();
    (useAuthStore as any).mockImplementation(() => ({
      login: jest.fn(),
      status: 'idle',
      error: 'Invalid credentials'
    }));
    render(<LoginForm />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.getByText('Usuarios disponibles para ingresar:')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('user3')).toBeInTheDocument();
    expect(screen.getByText('Contraseña: user1234')).toBeInTheDocument();
    (useAuthStore as any).mockImplementation(previousImpl);
  });

  it('does not navigate when store reports error', async () => {
    const user = userEvent.setup();
    (useAuthStore as any).getState = () => ({ error: 'error' });
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/Usuario/i), 'user');
    await user.type(screen.getByLabelText(/Contraseñ?a/i), 'pass');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(pushMock).not.toHaveBeenCalled();
    (useAuthStore as any).getState = () => ({ error: null });
  });

  it('ignores submit while submitting', async () => {
    const user = userEvent.setup();
    let resolveLogin: () => void;
    const loginPromise = new Promise<void>((resolve) => {
      resolveLogin = resolve;
    });
    (useAuthStore as any)().login.mockReturnValue(loginPromise);

    const { container } = render(<LoginForm />);
    await user.type(screen.getByLabelText(/Usuario/i), 'user');
    await user.type(screen.getByLabelText(/Contraseñ?a/i), 'pass');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Ingresando...' })).toBeDisabled());
    fireEvent.submit(container.querySelector('form')!);

    expect((useAuthStore as any)().login).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolveLogin!();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/Contraseñ?a/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(passwordInput.type).toBe('text');

    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(passwordInput.type).toBe('password');
  });
});

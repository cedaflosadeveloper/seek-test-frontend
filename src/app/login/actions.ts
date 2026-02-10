'use server';

import { cookies } from 'next/headers';
import type { LoginInput, LoginResult } from '@/core/ports/authRepository';

const BACKEND_URL = process.env.BACKEND_URL ?? 'https://seek-test-api.onrender.com';

type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: { id: string; email: string; name: string };
};

type LoginError = {
  error: string;
};

/**
 * Valida credenciales en el backend y persiste el token como cookie httpOnly.
 */
export const loginAction = async (input: LoginInput): Promise<LoginResult | LoginError> => {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: input.username, password: input.password }),
    cache: 'no-store'
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message =
      data && typeof data === 'object' && 'message' in data
        ? Array.isArray((data as any).message)
          ? (data as any).message.join(', ')
          : (data as any).message
        : 'Credenciales invalidas';
    return { error: message };
  }

  const data = (await response.json()) as LoginResponse;
  const cookieStore = await cookies();

  cookieStore.set('task_app_token', data.access_token, {
    path: '/',
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  cookieStore.set('task_app_user', data.user.email, {
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'lax'
  });

  return { userEmail: data.user.email };
};

/** Limpia las cookies de sesion. */
export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.set('task_app_token', '', { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax' });
  cookieStore.set('task_app_user', '', { path: '/', maxAge: 0, sameSite: 'lax' });
};

import 'client-only';

import type { AuthRepository, LoginInput, LoginResult } from '@/core/ports/authRepository';
import { loginAction } from '@/app/login/actions';

/** Repositorio de auth que delega en Server Actions. */
export const authApi: AuthRepository = {
  async login(input: LoginInput): Promise<LoginResult> {
    const result = await loginAction(input);
    if ('error' in result) {
      throw new Error(result.error);
    }
    return result;
  }
};

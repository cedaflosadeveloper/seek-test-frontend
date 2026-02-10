import 'client-only';

import type { AuthRepository, LoginInput, LoginResult } from '@/core/ports/authRepository';
import { loginAction } from '@/app/login/actions';

/** Repositorio de auth que delega en Server Actions. */
export const authApi: AuthRepository = {
  async login(input: LoginInput): Promise<LoginResult> {
    return loginAction(input);
  }
};

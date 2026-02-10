import type { AuthRepository, LoginInput } from '@/core/ports/authRepository';

export const createAuthUseCases = (repo: AuthRepository) => ({
  login: (input: LoginInput) => repo.login(input)
});

import 'client-only';

import { httpClient } from '@/infra/api/httpClient';
import { createTaskApi } from '@/infra/api/taskApi';
import { authApi } from '@/infra/api/authApi';
import type { HttpClient } from '@/core/ports/httpClient';
import type { TaskRepository } from '@/core/ports/taskRepository';
import type { AuthRepository } from '@/core/ports/authRepository';

export type Container = {
  httpClient: HttpClient;
  taskRepo: TaskRepository;
  authRepo: AuthRepository;
};

export const createContainer = (deps?: Partial<Container>): Container => {
  const httpClientInstance = deps?.httpClient ?? httpClient;
  const taskRepo = deps?.taskRepo ?? createTaskApi(httpClientInstance);
  const authRepo = deps?.authRepo ?? authApi;

  return { httpClient: httpClientInstance, taskRepo, authRepo };
};

export const container = createContainer();

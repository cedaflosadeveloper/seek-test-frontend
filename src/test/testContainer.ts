import { createContainer } from '@/infra/container';
import { httpClient } from '@/infra/api/httpClient';
import { createTaskApi } from '@/infra/api/taskApi';
import { authApi } from '@/infra/api/authApi';

export const testContainer = createContainer({
  httpClient,
  taskRepo: createTaskApi(httpClient),
  authRepo: authApi
});

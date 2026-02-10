import { createContainer } from '@/infra/container';
import { httpClient } from '@/infra/api/httpClient';
import { authApi } from '@/infra/api/authApi';

describe('container', () => {
  it('uses defaults when no deps are provided', () => {
    const result = createContainer();
    expect(result.httpClient).toBe(httpClient);
    expect(result.authRepo).toBe(authApi);
    expect(typeof result.taskRepo.list).toBe('function');
  });

  it('uses provided dependencies when supplied', () => {
    const customHttp = { request: jest.fn() } as any;
    const customTask = { list: jest.fn() } as any;
    const customAuth = { login: jest.fn() } as any;

    const result = createContainer({
      httpClient: customHttp,
      taskRepo: customTask,
      authRepo: customAuth
    });

    expect(result.httpClient).toBe(customHttp);
    expect(result.taskRepo).toBe(customTask);
    expect(result.authRepo).toBe(customAuth);
  });
});

import { testContainer } from '@/test/testContainer';
import { httpClient } from '@/infra/api/httpClient';
import { authApi } from '@/infra/api/authApi';

describe('testContainer', () => {
  it('exposes mocked dependencies', () => {
    expect(testContainer.httpClient).toBe(httpClient);
    expect(testContainer.authRepo).toBe(authApi);
    expect(typeof testContainer.taskRepo.list).toBe('function');
  });
});

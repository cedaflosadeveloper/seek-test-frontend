import { httpClient } from '@/infra/api/httpClient';
import { tokenStorage } from '@/infra/storage/tokenStorage';
const mockFetchJson = (status: number, data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: async () => data,
    text: async () => JSON.stringify(data)
  });
};

describe('http client', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it('rejects when backend responds unauthorized', async () => {
    mockFetchJson(401, { message: 'No autorizado' });
    await expect(
      httpClient.request({ method: 'GET', url: '/tasks', requiresAuth: true })
    ).rejects.toThrow('No autorizado');
  });

  it('does not include auth header when token is httpOnly', async () => {
    mockFetchJson(200, { ok: true });
    await expect(
      httpClient.request({ method: 'GET', url: '/api/tasks', requiresAuth: true })
    ).resolves.toEqual({ data: { ok: true } });

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/api/tasks');
    expect(options.headers.Authorization).toBeUndefined();
  });

  it('includes auth header when token is available', async () => {
    const spy = jest.spyOn(tokenStorage, 'get').mockReturnValue('token');
    mockFetchJson(200, { ok: true });
    await httpClient.request({ method: 'GET', url: '/api/tasks', requiresAuth: true });
    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers.Authorization).toBe('Bearer token');
    spy.mockRestore();
  });

  it('includes body when provided', async () => {
    mockFetchJson(200, { ok: true });
    await httpClient.request({
      method: 'POST',
      url: '/api/tasks',
      requiresAuth: true,
      body: { title: 't' }
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.body).toBe(JSON.stringify({ title: 't' }));
  });

  it('allows request when auth is not required', async () => {
    mockFetchJson(200, { ok: true });
    await expect(
      httpClient.request({ method: 'GET', url: '/public', requiresAuth: false })
    ).resolves.toEqual({ data: { ok: true } });
  });

  it('prefixes base url when configured', async () => {
    const original = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = 'http://api.local/';
    jest.resetModules();
    const { httpClient: client } = await import('@/infra/api/httpClient');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ ok: true }),
      text: async () => ''
    });

    await client.request({ method: 'GET', url: '/tasks', requiresAuth: false });
    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://api.local/tasks');

    process.env.NEXT_PUBLIC_API_URL = original;
  });

  it('does not prefix api routes when base url is configured', async () => {
    const original = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = 'http://api.local/';
    jest.resetModules();
    const { httpClient: client } = await import('@/infra/api/httpClient');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ ok: true }),
      text: async () => ''
    });

    await client.request({ method: 'GET', url: '/api/tasks', requiresAuth: false });
    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/api/tasks');

    process.env.NEXT_PUBLIC_API_URL = original;
  });

  it('keeps absolute urls intact', async () => {
    mockFetchJson(200, { ok: true });
    await httpClient.request({ method: 'GET', url: 'https://example.com', requiresAuth: false });
    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://example.com');
  });

  it('adds leading slash when missing', async () => {
    mockFetchJson(200, { ok: true });
    await httpClient.request({ method: 'GET', url: 'tasks', requiresAuth: false });
    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/tasks');
  });

  it('returns null when json parsing fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => {
        throw new Error('boom');
      },
      text: async () => ''
    });

    await expect(
      httpClient.request({ method: 'GET', url: '/api/tasks', requiresAuth: false })
    ).resolves.toEqual({ data: null });
  });

  it('returns text body when response is not json', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'text/plain' },
      json: async () => ({}),
      text: async () => 'ok'
    });

    await expect(
      httpClient.request({ method: 'GET', url: '/public', requiresAuth: false })
    ).resolves.toEqual({ data: 'ok' });
  });

  it('uses error message array when provided', async () => {
    mockFetchJson(400, { message: ['Error uno', 'Error dos'] });
    await expect(
      httpClient.request({ method: 'GET', url: '/api/tasks', requiresAuth: false })
    ).rejects.toThrow('Error uno, Error dos');
  });

  it('uses plain text error when content-type is missing', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: { get: () => null },
      json: async () => ({}),
      text: async () => 'Problema'
    });

    await expect(
      httpClient.request({ method: 'GET', url: '/api/tasks', requiresAuth: false })
    ).rejects.toThrow('Problema');
  });

  it('uses error field when provided', async () => {
    mockFetchJson(500, { error: 'Falla' });
    await expect(
      httpClient.request({ method: 'GET', url: '/api/tasks', requiresAuth: false })
    ).rejects.toThrow('Falla');
  });

  it('falls back to http status when error body is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 418,
      headers: { get: () => 'text/plain' },
      json: async () => ({}),
      text: async () => ''
    });

    await expect(
      httpClient.request({ method: 'GET', url: '/api/tasks', requiresAuth: false })
    ).rejects.toThrow('HTTP 418');
  });
});

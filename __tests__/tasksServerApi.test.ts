const mockFetch = (response: Partial<Response> & { json?: () => Promise<unknown>; text?: () => Promise<string> }) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    headers: response.headers ?? { get: () => 'application/json' },
    json: response.json ?? (async () => ({})),
    text: response.text ?? (async () => '')
  } as Response);
};

describe('tasksServerApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches tasks with auth header and maps status variants', async () => {
    process.env.BACKEND_URL = 'http://backend';
    jest.resetModules();
    const { getTasks } = await import('@/infra/server/tasksServerApi');

    mockFetch({
      json: async () => [
        {
          id: '1',
          userId: 'u1',
          title: 'A',
          status: 'in_progress',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: '2',
          userId: 'u1',
          title: 'B',
          done: true,
          createdAt: '2024-01-02',
          updatedAt: '2024-01-02'
        },
        {
          id: '3',
          userId: 'u1',
          title: 'C',
          done: false,
          createdAt: '2024-01-03',
          updatedAt: '2024-01-03'
        },
        {
          id: '4',
          userId: 'u1',
          title: 'D',
          createdAt: '2024-01-04',
          updatedAt: '2024-01-04'
        }
      ]
    });

    const result = await getTasks('token');
    expect(result).toEqual([
      { id: '1', title: 'A', description: '', status: 'in_progress', createdAt: '2024-01-01' },
      { id: '2', title: 'B', description: '', status: 'done', createdAt: '2024-01-02' },
      { id: '3', title: 'C', description: '', status: 'todo', createdAt: '2024-01-03' },
      { id: '4', title: 'D', description: '', status: 'todo', createdAt: '2024-01-04' }
    ]);

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://backend/tasks');
    expect(options.headers.Authorization).toBe('Bearer token');
    expect(options.next).toEqual({ tags: ['tasks'] });
  });

  it('fetches task by id', async () => {
    process.env.BACKEND_URL = 'http://backend';
    jest.resetModules();
    const { getTaskById } = await import('@/infra/server/tasksServerApi');

    mockFetch({
      json: async () => ({
        id: '99',
        userId: 'u1',
        title: 'Editar',
        description: 'Detalle',
        status: 'done',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-05'
      })
    });

    const result = await getTaskById('token', '99');
    expect(result).toEqual({
      id: '99',
      title: 'Editar',
      description: 'Detalle',
      status: 'done',
      createdAt: '2024-01-05'
    });

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://backend/tasks/99');
    expect(options.next).toEqual({ tags: ['tasks', 'task:99'] });
  });

  it('throws when backend responds with error text', async () => {
    process.env.BACKEND_URL = 'http://backend';
    jest.resetModules();
    const { getTasks } = await import('@/infra/server/tasksServerApi');

    mockFetch({
      ok: false,
      status: 500,
      text: async () => 'boom'
    });

    await expect(getTasks('token')).rejects.toThrow('boom');
  });

  it('uses default backend url when env is missing', async () => {
    delete process.env.BACKEND_URL;
    jest.resetModules();
    const { getTasks } = await import('@/infra/server/tasksServerApi');

    mockFetch({
      json: async () => []
    });

    await getTasks('token');
    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://seek-test-api.onrender.com/tasks');
  });

  it('throws with http status when error text is empty', async () => {
    process.env.BACKEND_URL = 'http://backend';
    jest.resetModules();
    const { getTasks } = await import('@/infra/server/tasksServerApi');

    mockFetch({
      ok: false,
      status: 503,
      text: async () => ''
    });

    await expect(getTasks('token')).rejects.toThrow('HTTP 503');
  });
});

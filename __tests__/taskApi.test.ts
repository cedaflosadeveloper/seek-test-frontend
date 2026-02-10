import { taskApi } from '@/infra/api/taskApi';

const mockFetchJsonOnce = (status: number, data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: async () => data,
    text: async () => JSON.stringify(data)
  });
};

describe('task api', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('rejects when backend returns unauthorized', async () => {
    mockFetchJsonOnce(401, { message: 'No autorizado' });
    await expect(taskApi.list()).rejects.toThrow('No autorizado');
  });

  it('maps list response to domain tasks', async () => {
    mockFetchJsonOnce(200, [
      {
        id: '1',
        userId: 'u1',
        title: 'T1',
        description: 'D1',
        status: 'todo',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '2',
        userId: 'u1',
        title: 'T2',
        status: 'done',
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02'
      }
    ]);

    const result = await taskApi.list();
    expect(result).toEqual([
      {
        id: '1',
        title: 'T1',
        description: 'D1',
        status: 'todo',
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        title: 'T2',
        description: '',
        status: 'done',
        createdAt: '2024-01-02'
      }
    ]);
  });

  it('falls back to done or default status when status is missing', async () => {
    mockFetchJsonOnce(200, [
      {
        id: '1',
        userId: 'u1',
        title: 'T1',
        done: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '2',
        userId: 'u1',
        title: 'T2',
        done: false,
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02'
      },
      {
        id: '3',
        userId: 'u1',
        title: 'T3',
        createdAt: '2024-01-03',
        updatedAt: '2024-01-03'
      }
    ]);

    const result = await taskApi.list();
    expect(result[0].status).toBe('done');
    expect(result[1].status).toBe('todo');
    expect(result[2].status).toBe('todo');
  });

  it('creates a task with trimmed fields', async () => {
    mockFetchJsonOnce(201, {
      id: '3',
      userId: 'u1',
      title: 'Nueva',
      description: 'Detalle',
      status: 'todo',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    });

    await taskApi.create({ title: ' Nueva ', description: ' Detalle ', status: 'todo' });
    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ title: 'Nueva', description: 'Detalle', status: 'todo' }));
  });

  it('defaults status to todo when not provided', async () => {
    mockFetchJsonOnce(201, {
      id: '4',
      userId: 'u1',
      title: 'Sin estado',
      description: 'Detalle',
      status: 'todo',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-04'
    });

    await taskApi.create({ title: 'Sin estado', description: 'Detalle' });
    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.body).toBe(JSON.stringify({ title: 'Sin estado', description: 'Detalle', status: 'todo' }));
  });

  it('updates task status using status field', async () => {
    mockFetchJsonOnce(200, {
      id: '1',
      userId: 'u1',
      title: 'T1',
      description: 'D1',
      status: 'done',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-04'
    });

    await taskApi.updateStatus({ id: '1', status: 'done' });
    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe('PATCH');
    expect(options.body).toBe(JSON.stringify({ status: 'done' }));
  });

  it('updates task using PATCH', async () => {
    mockFetchJsonOnce(200, {
      id: '1',
      userId: 'u1',
      title: 'Editada',
      description: 'Detalle',
      status: 'todo',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-05'
    });

    await taskApi.update({ id: '1', title: 'Editada', description: 'Detalle', status: 'todo' });
    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe('PATCH');
    expect(options.body).toBe(
      JSON.stringify({ title: 'Editada', description: 'Detalle', status: 'todo' })
    );
  });

  it('removes a task', async () => {
    mockFetchJsonOnce(200, { ok: true });
    await taskApi.remove('1');
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('/tasks/1');
    expect(options.method).toBe('DELETE');
  });
});

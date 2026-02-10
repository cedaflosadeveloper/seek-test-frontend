import { useTaskStore } from '@/state/taskStore';
import { container } from '@/infra/container';

const mockFetchJsonOnce = (status: number, data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: async () => data,
    text: async () => JSON.stringify(data)
  });
};

const apiTask = (overrides?: Partial<any>) => ({
  id: '1',
  userId: 'u1',
  title: 'Tarea ejemplo',
  description: 'Detalle',
  status: 'todo',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  ...overrides
});

beforeEach(() => {
  window.localStorage.clear();
  useTaskStore.setState({ tasks: [], status: 'idle', error: null });
});

describe('task store', () => {
  it('loads tasks', async () => {
    mockFetchJsonOnce(200, [apiTask()]);
    await useTaskStore.getState().load();
    expect(useTaskStore.getState().tasks).toHaveLength(1);
  });

  it('dedupes concurrent loads', async () => {
    let resolveList: (value: any) => void;
    const spy = jest
      .spyOn(container.taskRepo, 'list')
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveList = resolve;
          })
      );

    try {
      const first = useTaskStore.getState().load();
      const second = useTaskStore.getState().load();
      expect(container.taskRepo.list).toHaveBeenCalledTimes(1);

      resolveList!([apiTask()]);
      await Promise.all([first, second]);
    } finally {
      spy.mockRestore();
    }
  });

  it('creates a task', async () => {
    mockFetchJsonOnce(201, apiTask({ id: '2', title: 'Nueva', description: 'Detalle', status: 'in_progress' }));
    await useTaskStore.getState().create('Nueva', 'Detalle', 'in_progress');
    expect(useTaskStore.getState().tasks[0].title).toBe('Nueva');
  });

  it('sets tasks directly', () => {
    const list = [apiTask({ id: 'a' }), apiTask({ id: 'b', title: 'Otra' })];
    useTaskStore.getState().setTasks(list);
    expect(useTaskStore.getState().tasks).toHaveLength(2);
    expect(useTaskStore.getState().tasks[1].title).toBe('Otra');
  });

  it('sets error when title is empty', async () => {
    await useTaskStore.getState().create(' ', 'Detalle');
    expect(useTaskStore.getState().error).toBe('El titulo es obligatorio');
  });

  it('updates task status', async () => {
    mockFetchJsonOnce(200, [apiTask()]);
    await useTaskStore.getState().load();
    const taskId = useTaskStore.getState().tasks[0].id;
    mockFetchJsonOnce(200, apiTask({ id: taskId, status: 'done' }));
    await useTaskStore.getState().updateStatus(taskId, 'done');
    expect(useTaskStore.getState().tasks[0].status).toBe('done');
  });

  it('keeps other tasks untouched on updateStatus', async () => {
    mockFetchJsonOnce(200, [apiTask()]);
    await useTaskStore.getState().load();
    const base = useTaskStore.getState().tasks[0];
    const extra = { ...base, id: 'x', title: 'Otra' };
    useTaskStore.setState({ tasks: [extra, base] });
    mockFetchJsonOnce(200, apiTask({ id: base.id, status: 'done' }));
    await useTaskStore.getState().updateStatus(base.id, 'done');
    expect(useTaskStore.getState().tasks[0].title).toBe('Otra');
  });

  it('keeps other tasks untouched on updateTask', async () => {
    mockFetchJsonOnce(200, [apiTask()]);
    await useTaskStore.getState().load();
    const base = useTaskStore.getState().tasks[0];
    const extra = { ...base, id: 'x', title: 'Otra' };
    useTaskStore.setState({ tasks: [extra, base] });
    mockFetchJsonOnce(200, apiTask({ id: base.id, title: 'Editada', status: 'done' }));
    await useTaskStore.getState().updateTask(base.id, 'Editada', 'Detalle', 'done');
    expect(useTaskStore.getState().tasks[0].title).toBe('Otra');
  });

  it('updates task data', async () => {
    mockFetchJsonOnce(200, [apiTask()]);
    await useTaskStore.getState().load();
    const taskId = useTaskStore.getState().tasks[0].id;
    mockFetchJsonOnce(200, apiTask({ id: taskId, title: 'Editada', description: 'Detalle', status: 'done' }));
    await useTaskStore.getState().updateTask(taskId, 'Editada', 'Detalle', 'done');
    const updated = useTaskStore.getState().tasks[0];
    expect(updated.title).toBe('Editada');
    expect(updated.description).toBe('Detalle');
    expect(updated.status).toBe('done');
  });

  it('removes a task', async () => {
    mockFetchJsonOnce(200, [apiTask()]);
    await useTaskStore.getState().load();
    const taskId = useTaskStore.getState().tasks[0].id;
    mockFetchJsonOnce(200, { ok: true });
    await useTaskStore.getState().remove(taskId);
    expect(useTaskStore.getState().tasks.find((task) => task.id === taskId)).toBeUndefined();
  });

  it('sets error when unauthorized', async () => {
    mockFetchJsonOnce(401, { message: 'No autorizado' });
    await useTaskStore.getState().load();
    expect(useTaskStore.getState().status).toBe('error');
  });

  it('sets generic error for non-error rejection', async () => {
    const spy = jest.spyOn(container.taskRepo, 'list').mockRejectedValue('boom');
    await useTaskStore.getState().load();
    expect(useTaskStore.getState().error).toBe('Error inesperado');
    spy.mockRestore();
  });
});

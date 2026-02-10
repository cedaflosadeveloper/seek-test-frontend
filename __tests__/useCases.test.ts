import { createTaskUseCases } from '@/core/usecases/taskUseCases';
import { createAuthUseCases } from '@/core/usecases/authUseCases';

describe('use cases', () => {
  it('calls task repository methods', async () => {
    const repo = {
      list: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({}),
      updateStatus: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      remove: jest.fn().mockResolvedValue(undefined)
    };

    const useCases = createTaskUseCases(repo as any);
    await useCases.listTasks();
    await useCases.createTask({ title: 'a', description: 'b', status: 'todo' });
    await useCases.updateTaskStatus({ id: '1', status: 'done' });
    await useCases.updateTask({ id: '1', title: 'a', description: 'b', status: 'done' });
    await useCases.deleteTask('1');

    expect(repo.list).toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalled();
    expect(repo.updateStatus).toHaveBeenCalled();
    expect(repo.update).toHaveBeenCalled();
    expect(repo.remove).toHaveBeenCalled();
  });

  it('calls auth repository methods', async () => {
    const repo = {
      login: jest.fn().mockResolvedValue({ userEmail: 'u' })
    };
    const useCases = createAuthUseCases(repo as any);
    await useCases.login({ username: 'u', password: 'p' });
    expect(repo.login).toHaveBeenCalledWith({ username: 'u', password: 'p' });
  });
});

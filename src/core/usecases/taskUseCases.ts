import type {
  TaskRepository,
  CreateTaskInput,
  UpdateTaskStatusInput,
  UpdateTaskInput
} from '@/core/ports/taskRepository';

export const createTaskUseCases = (repo: TaskRepository) => ({
  listTasks: () => repo.list(),
  createTask: (input: CreateTaskInput) => repo.create(input),
  updateTaskStatus: (input: UpdateTaskStatusInput) => repo.updateStatus(input),
  updateTask: (input: UpdateTaskInput) => repo.update(input),
  deleteTask: (id: string) => repo.remove(id)
});

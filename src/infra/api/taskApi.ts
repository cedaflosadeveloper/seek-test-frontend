import 'client-only';

import type {
  TaskRepository,
  CreateTaskInput,
  UpdateTaskStatusInput,
  UpdateTaskInput
} from '@/core/ports/taskRepository';
import type { Task, TaskStatus } from '@/core/domain/task';
import type { HttpClient } from '@/core/ports/httpClient';
import { httpClient } from '@/infra/api/httpClient';

type ApiTask = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  done?: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Normaliza estado cuando el backend usa `done` o `status`. */
const resolveStatus = (task: ApiTask): TaskStatus => {
  if (task.status) return task.status;
  if (typeof task.done === 'boolean') return task.done ? 'done' : 'todo';
  return 'todo';
};

/** Mapea la respuesta del API al dominio. */
const mapApiTask = (task: ApiTask): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? '',
  status: resolveStatus(task),
  createdAt: task.createdAt
});

/** Implementacion del repositorio de tareas via API. */
export const createTaskApi = (client: HttpClient): TaskRepository => {
  return {
    async list() {
      const response = await client.request<ApiTask[]>({
        method: 'GET',
        url: '/api/tasks',
        requiresAuth: true
      });
      return response.data.map(mapApiTask);
    },
    async create(input: CreateTaskInput) {
      const response = await client.request<ApiTask>({
        method: 'POST',
        url: '/api/tasks',
        requiresAuth: true,
        body: {
          title: input.title.trim(),
          description: input.description.trim(),
          status: input.status ?? 'todo'
        }
      });
      return mapApiTask(response.data);
    },
    async updateStatus(input: UpdateTaskStatusInput) {
      const response = await client.request<ApiTask>({
        method: 'PATCH',
        url: `/api/tasks/${input.id}`,
        requiresAuth: true,
        body: { status: input.status }
      });
      return mapApiTask(response.data);
    },
    async update(input: UpdateTaskInput) {
      const response = await client.request<ApiTask>({
        method: 'PATCH',
        url: `/api/tasks/${input.id}`,
        requiresAuth: true,
        body: {
          title: input.title.trim(),
          description: input.description.trim(),
          status: input.status
        }
      });
      return mapApiTask(response.data);
    },
    async remove(id: string) {
      await client.request({
        method: 'DELETE',
        url: `/api/tasks/${id}`,
        requiresAuth: true
      });
    }
  };
};

/** Instancia por defecto del repositorio de tareas. */
export const taskApi: TaskRepository = createTaskApi(httpClient);

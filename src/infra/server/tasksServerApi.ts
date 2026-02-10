import 'server-only';

import type { Task, TaskStatus } from '@/core/domain/task';

const BACKEND_URL = process.env.BACKEND_URL ?? 'https://seek-test-api.onrender.com';

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

const resolveStatus = (task: ApiTask): TaskStatus => {
  if (task.status) return task.status;
  if (typeof task.done === 'boolean') return task.done ? 'done' : 'todo';
  return 'todo';
};

const mapApiTask = (task: ApiTask): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? '',
  status: resolveStatus(task),
  createdAt: task.createdAt
});

/** Fetch con auth y tags para revalidacion. Solo server. */
const fetchJson = async <T>(path: string, token: string, tags: string[]): Promise<T> => {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    next: { tags }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  return (await response.json()) as T;
};

/** Obtiene tareas y las normaliza al dominio. */
export const getTasks = async (token: string): Promise<Task[]> => {
  const data = await fetchJson<ApiTask[]>('/tasks', token, ['tasks']);
  return data.map(mapApiTask);
};

/** Obtiene una tarea por id. */
export const getTaskById = async (token: string, id: string): Promise<Task> => {
  const data = await fetchJson<ApiTask>(`/tasks/${id}`, token, ['tasks', `task:${id}`]);
  return mapApiTask(data);
};

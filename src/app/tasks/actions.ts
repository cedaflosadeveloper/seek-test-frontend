'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

const BACKEND_URL = process.env.BACKEND_URL ?? 'https://seek-test-api.onrender.com';
const REVALIDATE_NOW = { expire: 0 };

type TaskStatus = 'todo' | 'in_progress' | 'done';

type TaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
};

/** Obtiene el token desde cookies en el server. */
const getToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('task_app_token')?.value;
  if (!token) throw new Error('No autorizado');
  return token;
};

/** Envia una peticion autenticada al backend. */
const request = async (path: string, method: string, body?: unknown) => {
  const token = await getToken();
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') ?? '';
  return contentType.includes('application/json') ? response.json() : response.text();
};

/** Crea una tarea y revalida la lista. */
export const createTaskAction = async (input: TaskInput) => {
  await request('/tasks', 'POST', input);
  revalidateTag('tasks', REVALIDATE_NOW);
};

/** Actualiza una tarea y revalida detalle y lista. */
export const updateTaskAction = async (id: string, input: TaskInput) => {
  await request(`/tasks/${id}`, 'PATCH', input);
  revalidateTag('tasks', REVALIDATE_NOW);
  revalidateTag(`task:${id}`, REVALIDATE_NOW);
};

/** Elimina una tarea y revalida cache. */
export const deleteTaskAction = async (id: string) => {
  await request(`/tasks/${id}`, 'DELETE');
  revalidateTag('tasks', REVALIDATE_NOW);
  revalidateTag(`task:${id}`, REVALIDATE_NOW);
};

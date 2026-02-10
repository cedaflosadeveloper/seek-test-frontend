'use client';

import { create } from 'zustand';
import type { Task, TaskStatus } from '@/core/domain/task';
import { container } from '@/infra/container';
import { createTaskUseCases } from '@/core/usecases/taskUseCases';

const taskUseCases = createTaskUseCases(container.taskRepo);

type TaskState = {
  tasks: Task[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  load: () => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  create: (title: string, description: string, status?: TaskStatus) => Promise<void>;
  updateStatus: (id: string, status: TaskStatus) => Promise<void>;
  updateTask: (id: string, title: string, description: string, status: TaskStatus) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

// Evita disparar multiples loads simultaneos.
let loadInFlight: Promise<void> | null = null;

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  status: 'idle',
  error: null,
  async load() {
    if (loadInFlight) return loadInFlight;
    set({ status: 'loading', error: null });
    loadInFlight = (async () => {
      try {
        const tasks = await taskUseCases.listTasks();
        set({ tasks, status: 'idle' });
      } catch (error) {
        set({
          status: 'error',
          error: error instanceof Error ? error.message : 'Error inesperado'
        });
      } finally {
        loadInFlight = null;
      }
    })();
    return loadInFlight;
  },
  setTasks(tasks) {
    set({ tasks, status: 'idle', error: null });
  },
  async create(title, description, status = 'todo') {
    if (!title.trim()) {
      set({ error: 'El titulo es obligatorio' });
      return;
    }
    const task = await taskUseCases.createTask({ title, description, status });
    set({ tasks: [task, ...get().tasks], error: null });
  },
  async updateStatus(id, status) {
    const updated = await taskUseCases.updateTaskStatus({ id, status });
    set({
      tasks: get().tasks.map((task) => (task.id === id ? updated : task))
    });
  },
  async updateTask(id, title, description, status) {
    const updated = await taskUseCases.updateTask({ id, title, description, status });
    set({
      tasks: get().tasks.map((task) => (task.id === id ? updated : task))
    });
  },
  async remove(id) {
    await taskUseCases.deleteTask(id);
    set({ tasks: get().tasks.filter((task) => task.id !== id) });
  }
}));

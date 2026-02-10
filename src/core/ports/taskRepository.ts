import type { Task, TaskStatus } from '@/core/domain/task';

export type CreateTaskInput = {
  title: string;
  description: string;
  status?: TaskStatus;
};

export type UpdateTaskStatusInput = {
  id: string;
  status: TaskStatus;
};

export type UpdateTaskInput = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

export interface TaskRepository {
  list(): Promise<Task[]>;
  create(input: CreateTaskInput): Promise<Task>;
  updateStatus(input: UpdateTaskStatusInput): Promise<Task>;
  update(input: UpdateTaskInput): Promise<Task>;
  remove(id: string): Promise<void>;
}

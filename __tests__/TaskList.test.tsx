import { render, screen } from '@testing-library/react';
import type { Task } from '@/core/domain/task';
import { TaskList } from '@/components/tasks/TaskList';

describe('TaskList', () => {
  it('renders empty state', () => {
    render(
      <TaskList tasks={[]} isLoading={false} onDeleteRequest={jest.fn()} />
    );
    expect(screen.getByText('No hay tareas. Crea la primera.')).toBeInTheDocument();
  });

  it('renders tasks', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Uno',
        description: 'Desc',
        status: 'todo',
        createdAt: new Date().toISOString()
      }
    ];

    render(
      <TaskList tasks={tasks} isLoading={false} onDeleteRequest={jest.fn()} />
    );

    expect(screen.getByText('Uno')).toBeInTheDocument();
  });

  it('renders skeletons when loading', () => {
    render(<TaskList tasks={[]} isLoading={true} onDeleteRequest={jest.fn()} />);
    expect(document.querySelectorAll('.skeleton').length).toBe(3);
  });
});

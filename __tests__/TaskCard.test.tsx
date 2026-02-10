import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Task } from '@/core/domain/task';
import { TaskCard } from '@/components/tasks/TaskCard';

describe('TaskCard', () => {
  const task: Task = {
    id: '1',
    title: 'Demo',
    description: 'Descripcion',
    status: 'todo',
    createdAt: new Date().toISOString()
  };

  it('renders task basics', () => {
    const onDeleteRequest = jest.fn();

    render(<TaskCard task={task} onDeleteRequest={onDeleteRequest} />);

    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(screen.getByText('Descripcion')).toBeInTheDocument();
    expect(screen.getByText('Por hacer')).toBeInTheDocument();
    expect(screen.getByLabelText('Editar')).toBeInTheDocument();
    expect(screen.getByLabelText('Eliminar')).toBeInTheDocument();
  });

  it('shows full title tooltip on click when title is long', async () => {
    const user = userEvent.setup();
    const onDeleteRequest = jest.fn();
    const longTask: Task = {
      ...task,
      title: 'Titulo muy largo '.repeat(4)
    };

    render(<TaskCard task={longTask} onDeleteRequest={onDeleteRequest} />);
    await user.click(screen.getByRole('button', { name: /Titulo muy largo/i }));
    expect(screen.getByRole('tooltip')).toHaveTextContent(longTask.title.trim());
  });

  it('deletes task', async () => {
    const user = userEvent.setup();
    const onDeleteRequest = jest.fn();

    render(<TaskCard task={task} onDeleteRequest={onDeleteRequest} />);

    await user.click(screen.getByLabelText('Eliminar'));
    expect(onDeleteRequest).toHaveBeenCalledWith(task);
  });
});

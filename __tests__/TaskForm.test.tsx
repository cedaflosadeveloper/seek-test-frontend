import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '@/components/tasks/TaskForm';

describe('TaskForm', () => {
  it('submits new task data', async () => {
    const user = userEvent.setup();
    let resolveCreate: () => void;
    const onCreate = jest.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveCreate = resolve;
        })
    );

    render(<TaskForm mode="create" onSubmit={onCreate} isLoading={false} />);

    await user.type(screen.getByLabelText(/T[ií]tulo/i), 'Nueva tarea');
    await user.type(screen.getByLabelText(/Descripci[oó]n/i), 'Detalle');
    await user.click(screen.getByRole('button', { name: 'Guardar tarea' }));

    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        title: 'Nueva tarea',
        description: 'Detalle',
        status: 'todo'
      })
    );
    await act(async () => {
      resolveCreate!();
    });
    await waitFor(() => expect(screen.getByLabelText(/T[ií]tulo/i)).toHaveValue(''));
  });

  it('submits edited task data', async () => {
    const user = userEvent.setup();
    let resolveSave: () => void;
    const onSave = jest.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        })
    );

    render(
      <TaskForm
        mode="edit"
        initialTitle="Titulo"
        initialDescription="Descripcion"
        initialStatus="in_progress"
        onSubmit={onSave}
        isLoading={false}
      />
    );

    await user.clear(screen.getByLabelText(/T[ií]tulo/i));
    await user.type(screen.getByLabelText(/T[ií]tulo/i), 'Titulo editado');
    await user.click(screen.getByRole('button', { name: /Estado/i }));
    await user.click(screen.getByRole('option', { name: /Completada/i }));
    await user.click(screen.getByRole('button', { name: 'Guardar tarea' }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({
        title: 'Titulo editado',
        description: 'Descripcion',
        status: 'done'
      })
    );
    await act(async () => {
      resolveSave!();
    });
  });

  it('calls onDelete in edit mode', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <TaskForm
        mode="edit"
        initialTitle="Titulo"
        initialDescription="Descripcion"
        initialStatus="todo"
        onSubmit={jest.fn()}
        onDelete={onDelete}
        isLoading={false}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onDelete).toHaveBeenCalled();
  });

  it('ignores submit while submitting', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    const onSubmit = jest.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );

    const { container } = render(<TaskForm mode="create" onSubmit={onSubmit} isLoading={false} />);

    await user.type(screen.getByLabelText(/T[ií]tulo/i), 'Nueva tarea');
    await user.type(screen.getByLabelText(/Descripci[oó]n/i), 'Detalle');
    await user.click(screen.getByRole('button', { name: 'Guardar tarea' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Guardando...' })).toBeDisabled());
    fireEvent.submit(container.querySelector('form')!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolveSubmit!();
    });
  });
});

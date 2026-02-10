import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';

describe('DeleteConfirmModal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <DeleteConfirmModal title="Tarea" isOpen={false} onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders and triggers actions', async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(
      <DeleteConfirmModal
        title="Tarea"
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Confirmacion')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'No' }));
    expect(onCancel).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Sí' }));
    expect(onConfirm).toHaveBeenCalled();
  });
});

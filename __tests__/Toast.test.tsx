import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from '@/components/feedback/Toast';

describe('Toast', () => {
  it('renders message and closes', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<Toast message="Realizado correctamente" type="success" onClose={onClose} />);

    expect(screen.getByText('Realizado correctamente')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders nothing when message is empty', () => {
    const { container } = render(<Toast message="" type="success" onClose={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});

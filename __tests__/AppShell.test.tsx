import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from '@/components/layout/AppShell';

describe('AppShell', () => {
  it('renders title, subtitle and slots', async () => {
    const user = userEvent.setup();
    render(
      <AppShell
        title="Listado"
        subtitle="Subtitulo"
        leftSlot={<span>Izquierda</span>}
        menuActions={<span>Derecha</span>}
      >
        <div>Contenido</div>
      </AppShell>
    );

    expect(screen.getByText('Listado')).toBeInTheDocument();
    expect(screen.getByText('Subtitulo')).toBeInTheDocument();
    expect(screen.getByText('Izquierda')).toBeInTheDocument();
    expect(screen.getByText('Contenido')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Menú' }));
    expect(screen.getByText('Derecha')).toBeInTheDocument();
  });

  it('renders with minimal props', () => {
    render(
      <AppShell title="Solo titulo">
        <div>Contenido</div>
      </AppShell>
    );
    expect(screen.getByText('Solo titulo')).toBeInTheDocument();
  });
});

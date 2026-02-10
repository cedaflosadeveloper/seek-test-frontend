import { render, screen } from '@testing-library/react';
import { AppShell } from '@/components/layout/AppShell';

describe('AppShell', () => {
  it('renders title, subtitle and slots', () => {
    render(
      <AppShell
        title="Listado"
        subtitle="Subtitulo"
        leftSlot={<span>Izquierda</span>}
        rightSlot={<span>Derecha</span>}
      >
        <div>Contenido</div>
      </AppShell>
    );

    expect(screen.getByText('Listado')).toBeInTheDocument();
    expect(screen.getByText('Subtitulo')).toBeInTheDocument();
    expect(screen.getByText('Izquierda')).toBeInTheDocument();
    expect(screen.getByText('Derecha')).toBeInTheDocument();
    expect(screen.getByText('Contenido')).toBeInTheDocument();
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

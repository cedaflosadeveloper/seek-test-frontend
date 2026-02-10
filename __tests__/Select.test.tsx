import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/components/form/Select';

describe('Select', () => {
  it('opens, selects option and closes', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <Select
        value="todo"
        onChange={onChange}
        options={[
          { value: 'todo', label: 'Por hacer' },
          { value: 'done', label: 'Completada' }
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Por hacer' }));
    await user.click(screen.getByRole('option', { name: 'Completada' }));

    expect(onChange).toHaveBeenCalledWith('done');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on outside click and escape', async () => {
    const user = userEvent.setup();
    render(
      <Select
        value="todo"
        onChange={jest.fn()}
        options={[
          { value: 'todo', label: 'Por hacer' },
          { value: 'done', label: 'Completada' }
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Por hacer' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Por hacer' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows placeholder when value not found', () => {
    render(
      <Select
        value="missing"
        onChange={jest.fn()}
        options={[{ value: 'todo', label: 'Por hacer' }]}
        placeholder="Selecciona"
      />
    );

    expect(screen.getByRole('button', { name: 'Selecciona' })).toBeInTheDocument();
  });

  it('handles outside click when ref is null', () => {
    const externalRef = { current: null };
    render(
      <Select
        value="todo"
        onChange={jest.fn()}
        options={[{ value: 'todo', label: 'Por hacer' }]}
        containerRef={externalRef}
      />
    );
    externalRef.current = null;
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });
});

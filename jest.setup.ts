import '@testing-library/jest-dom';

beforeEach(() => {
  const existing = (global as any).fetch;
  if (existing && typeof existing.mockClear === 'function') {
    existing.mockClear();
    return;
  }
  (global as any).fetch = jest.fn();
});

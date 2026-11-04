import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPage from './error';

describe('error.tsx', () => {
  afterEach(() => vi.restoreAllMocks());

  it('muestra el mensaje de error y registra el error en consola', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('boom');

    render(<ErrorPage error={error} reset={() => {}} />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(spy).toHaveBeenCalledWith(error);
  });

  it('llama a reset al pulsar "Try again"', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reset = vi.fn();

    render(<ErrorPage error={new Error('boom')} reset={reset} />);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});

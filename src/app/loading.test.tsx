import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Loading from './loading';

describe('loading.tsx', () => {
  it('muestra 8 tarjetas esqueleto animadas', () => {
    const { container } = render(<Loading />);
    const tarjetas = container.querySelectorAll('.h-96.animate-pulse');
    expect(tarjetas).toHaveLength(8);
  });
});

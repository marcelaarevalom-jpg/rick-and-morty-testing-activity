import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Pagination from './Pagination';

describe('<Pagination />', () => {
  it('en la primera página deshabilita "Previous" y habilita "Next"', () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Previous/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next/ })).toHaveAttribute('href', '/?page=2');
  });

  it('en una página intermedia muestra ambos enlaces', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    expect(screen.getByRole('link', { name: /Previous/ })).toHaveAttribute('href', '/?page=2');
    expect(screen.getByRole('link', { name: /Next/ })).toHaveAttribute('href', '/?page=4');
  });

  it('en la última página deshabilita "Next" y habilita "Previous"', () => {
    render(<Pagination currentPage={5} totalPages={5} />);

    expect(screen.getByRole('link', { name: /Previous/ })).toHaveAttribute('href', '/?page=4');
    expect(screen.queryByRole('link', { name: /Next/ })).not.toBeInTheDocument();
  });

  it('con una sola página no muestra ningún enlace', () => {
    render(<Pagination currentPage={1} totalPages={1} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});

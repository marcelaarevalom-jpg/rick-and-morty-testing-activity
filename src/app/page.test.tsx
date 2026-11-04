import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';
import { getCharacters } from '@/lib/api';
import { makeResponse } from '@/test/fixtures';

vi.mock('@/lib/api', () => ({ getCharacters: vi.fn() }));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockedGetCharacters = vi.mocked(getCharacters);

describe('Home (page.tsx)', () => {
  beforeEach(() => {
    mockedGetCharacters.mockReset();
    mockedGetCharacters.mockResolvedValue(makeResponse(42));
  });

  it('muestra el título y una tarjeta por personaje', async () => {
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole('heading', { name: 'Rick and Morty Characters' })).toBeInTheDocument();
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('pide la página 1 cuando no hay parámetro page', async () => {
    await Home({ searchParams: Promise.resolve({}) });
    expect(mockedGetCharacters).toHaveBeenCalledWith(1);
  });

  it('usa el parámetro page de la URL', async () => {
    render(await Home({ searchParams: Promise.resolve({ page: '3' }) }));

    expect(mockedGetCharacters).toHaveBeenCalledWith(3);
    expect(screen.getByText('Page 3 of 42')).toBeInTheDocument();
  });

  it('ignora un parámetro page repetido (arreglo) y usa la página 1', async () => {
    await Home({ searchParams: Promise.resolve({ page: ['2', '3'] }) });
    expect(mockedGetCharacters).toHaveBeenCalledWith(1);
  });
});

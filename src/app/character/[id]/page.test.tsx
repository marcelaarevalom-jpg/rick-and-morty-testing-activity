import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterPage from './page';
import { getCharacter, getEpisodes } from '@/lib/api';
import { makeCharacter, makeEpisode } from '@/test/fixtures';

vi.mock('@/lib/api', () => ({ getCharacter: vi.fn(), getEpisodes: vi.fn() }));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockedGetCharacter = vi.mocked(getCharacter);
const mockedGetEpisodes = vi.mocked(getEpisodes);

const renderPage = async (id = '1') =>
  render(await CharacterPage({ params: Promise.resolve({ id }) }));

describe('CharacterPage (character/[id]/page.tsx)', () => {
  beforeEach(() => {
    mockedGetCharacter.mockReset();
    mockedGetEpisodes.mockReset();
    mockedGetCharacter.mockResolvedValue(makeCharacter());
    mockedGetEpisodes.mockResolvedValue([makeEpisode(1), makeEpisode(2)]);
  });

  it('muestra los datos principales del personaje', async () => {
    await renderPage();

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('pide el personaje por id y los episodios por los ids tomados de las URLs', async () => {
    await renderPage('1');

    expect(mockedGetCharacter).toHaveBeenCalledWith('1');
    expect(mockedGetEpisodes).toHaveBeenCalledWith(['1', '2']);
  });

  it('lista los episodios con su contador', async () => {
    await renderPage();

    expect(screen.getByText('Episodes (2)')).toBeInTheDocument();
    expect(screen.getByText('S01E01')).toBeInTheDocument();
    expect(screen.getByText('S01E02')).toBeInTheDocument();
  });

  it('formatea la fecha de creación en inglés', async () => {
    await renderPage();
    expect(screen.getByText('November 4, 2017')).toBeInTheDocument();
  });

  it('muestra "Unknown" cuando el personaje no tiene type', async () => {
    await renderPage();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('muestra el type cuando existe', async () => {
    mockedGetCharacter.mockResolvedValue(makeCharacter({ type: 'Genius' }));
    await renderPage();
    expect(screen.getByText('Genius')).toBeInTheDocument();
  });

  it.each([
    ['Alive', 'bg-green-500'],
    ['Dead', 'bg-red-500'],
    ['unknown', 'bg-gray-500'],
  ] as const)('pinta el indicador de estado %s', async (status, color) => {
    mockedGetCharacter.mockResolvedValue(makeCharacter({ status }));
    const { container } = await renderPage();
    expect(container.querySelector(`span.${color}`)).toBeInTheDocument();
  });

  it('tiene un enlace para volver a la lista', async () => {
    await renderPage();
    expect(screen.getByRole('link', { name: /Back to Characters/ })).toHaveAttribute('href', '/');
  });

  it('funciona cuando el personaje no tiene episodios', async () => {
    mockedGetCharacter.mockResolvedValue(makeCharacter({ episode: [] }));
    mockedGetEpisodes.mockResolvedValue([]);
    await renderPage();
    expect(screen.getByText('Episodes (0)')).toBeInTheDocument();
  });
});

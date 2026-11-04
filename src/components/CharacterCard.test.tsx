import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterCard from './CharacterCard';
import { makeCharacter } from '@/test/fixtures';

// next/image necesita configuración del servidor de Next; en tests lo reemplazamos por un <img>
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('<CharacterCard />', () => {
  it('muestra nombre, estado, especie y última ubicación', () => {
    render(<CharacterCard character={makeCharacter()} />);

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('enlaza al detalle del personaje', () => {
    render(<CharacterCard character={makeCharacter({ id: 7 })} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/character/7');
  });

  it('muestra la imagen con el nombre como texto alternativo', () => {
    render(<CharacterCard character={makeCharacter()} />);
    expect(screen.getByAltText('Rick Sanchez')).toHaveAttribute(
      'src',
      'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    );
  });

  it.each([
    ['Alive', 'bg-green-500'],
    ['Dead', 'bg-red-500'],
    ['unknown', 'bg-gray-500'],
  ] as const)('usa el color correcto para el estado %s', (status, color) => {
    const { container } = render(<CharacterCard character={makeCharacter({ status })} />);
    expect(container.querySelector(`span.${color}`)).toBeInTheDocument();
  });
});

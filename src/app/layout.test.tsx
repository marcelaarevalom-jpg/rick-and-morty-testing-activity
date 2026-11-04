import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout, { metadata } from './layout';

// next/font/google descarga fuentes en el build; en tests devolvemos clases falsas
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'font-geist-sans' }),
  Geist_Mono: () => ({ variable: 'font-geist-mono' }),
}));

describe('RootLayout (layout.tsx)', () => {
  const html = renderToStaticMarkup(
    <RootLayout>
      <p>contenido de prueba</p>
    </RootLayout>,
  );

  it('define el título y la descripción del sitio', () => {
    expect(metadata.title).toBe('Rick and Morty Explorer');
    expect(metadata.description).toBe('Explore the Rick and Morty universe');
  });

  it('renderiza los children dentro de <main>', () => {
    expect(html).toContain('<main class="flex-grow"><p>contenido de prueba</p></main>');
  });

  it('muestra la navegación con enlaces a Characters y API Docs', () => {
    expect(html).toContain('Rick &amp; Morty App');
    expect(html).toContain('Characters');
    expect(html).toContain('href="https://rickandmortyapi.com/documentation"');
  });

  it('muestra el footer con el crédito a la API', () => {
    expect(html).toContain('Data provided by');
    expect(html).toContain('href="https://rickandmortyapi.com"');
  });

  it('aplica las variables de fuente al body', () => {
    expect(html).toContain('font-geist-sans');
    expect(html).toContain('font-geist-mono');
  });
});

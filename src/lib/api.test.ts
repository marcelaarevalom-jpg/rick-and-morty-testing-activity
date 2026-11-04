import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCharacter, getCharacters, getEpisodes } from './api';
import { makeCharacter, makeEpisode, makeResponse } from '@/test/fixtures';

const BASE = 'https://rickandmortyapi.com/api';

const okResponse = (data: unknown) => ({ ok: true, json: async () => data }) as Response;
const failResponse = () => ({ ok: false, json: async () => ({}) }) as Response;

describe('lib/api', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  describe('getCharacters', () => {
    it('pide la página 1 por defecto y devuelve los datos', async () => {
      // Arrange
      const data = makeResponse();
      fetchMock.mockResolvedValue(okResponse(data));
      // Act
      const result = await getCharacters();
      // Assert
      expect(fetchMock).toHaveBeenCalledWith(`${BASE}/character?page=1`);
      expect(result).toEqual(data);
    });

    it('pide la página indicada', async () => {
      fetchMock.mockResolvedValue(okResponse(makeResponse()));
      await getCharacters(3);
      expect(fetchMock).toHaveBeenCalledWith(`${BASE}/character?page=3`);
    });

    it('lanza un error si la API responde con fallo', async () => {
      fetchMock.mockResolvedValue(failResponse());
      await expect(getCharacters(1)).rejects.toThrow('Failed to fetch characters');
    });
  });

  describe('getCharacter', () => {
    it('devuelve un personaje por id', async () => {
      const rick = makeCharacter();
      fetchMock.mockResolvedValue(okResponse(rick));
      const result = await getCharacter('1');
      expect(fetchMock).toHaveBeenCalledWith(`${BASE}/character/1`);
      expect(result.name).toBe('Rick Sanchez');
    });

    it('lanza un error si el personaje no existe', async () => {
      fetchMock.mockResolvedValue(failResponse());
      await expect(getCharacter('9999')).rejects.toThrow('Failed to fetch character details');
    });
  });

  describe('getEpisodes', () => {
    it('devuelve [] sin llamar a la API cuando no hay ids', async () => {
      const result = await getEpisodes([]);
      expect(result).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('une los ids con coma y devuelve el arreglo', async () => {
      const eps = [makeEpisode(1), makeEpisode(2)];
      fetchMock.mockResolvedValue(okResponse(eps));
      const result = await getEpisodes(['1', '2']);
      expect(fetchMock).toHaveBeenCalledWith(`${BASE}/episode/1,2`);
      expect(result).toHaveLength(2);
    });

    it('envuelve en arreglo cuando la API devuelve un solo objeto', async () => {
      fetchMock.mockResolvedValue(okResponse(makeEpisode(1)));
      const result = await getEpisodes(['1']);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].id).toBe(1);
    });

    it('lanza un error si la API falla', async () => {
      fetchMock.mockResolvedValue(failResponse());
      await expect(getEpisodes(['1'])).rejects.toThrow('Failed to fetch episodes');
    });
  });
});

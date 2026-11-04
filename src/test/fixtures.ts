import type { Character, CharacterResponse, Episode } from '@/types/rickandmorty';

export const makeCharacter = (over: Partial<Character> = {}): Character => ({
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
  ...over,
});

export const makeResponse = (pages = 42): CharacterResponse => ({
  info: { count: 826, pages, next: null, prev: null },
  results: [
    makeCharacter(),
    makeCharacter({ id: 2, name: 'Morty Smith', status: 'Dead', species: 'Human' }),
  ],
});

export const makeEpisode = (id: number, over: Partial<Episode> = {}): Episode => ({
  id,
  name: `Episode ${id}`,
  air_date: 'December 2, 2013',
  episode: `S01E0${id}`,
  characters: [],
  url: `https://rickandmortyapi.com/api/episode/${id}`,
  created: '2017-11-10T12:56:33.798Z',
  ...over,
});

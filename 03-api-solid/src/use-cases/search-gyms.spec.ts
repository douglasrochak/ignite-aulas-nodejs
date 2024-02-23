import { expect, it, describe, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case ', () => {
  beforeEach(() => {
    gymsRepository = InMemoryGymsRepository.getInstance();
    gymsRepository.clear();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    gymsRepository.create({
      id: 'gym-01',
      title: 'Academia 01',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    gymsRepository.create({
      id: 'gym-02',
      title: 'Academia 02',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({ query: 'Academia 02', page: 1 });

    expect(gyms.length).toBe(1);
    expect(gyms).toEqual([expect.objectContaining({ id: 'gym-02' })]);
  });

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      gymsRepository.create({
        id: `gym-${i.toString().padStart(2, '0')}`,
        title: `Academia ${i.toString().padStart(2, '0')}`,
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Academia',
      page: 2,
    });

    expect(gyms.length).toBe(2);
    expect(gyms).toEqual([
      expect.objectContaining({ id: 'gym-21' }),
      expect.objectContaining({ id: 'gym-22' }),
    ]);
  });
});

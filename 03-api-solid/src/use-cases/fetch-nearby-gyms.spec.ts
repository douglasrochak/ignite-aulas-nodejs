import { expect, it, describe, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case ', () => {
  beforeEach(() => {
    gymsRepository = InMemoryGymsRepository.getInstance();
    gymsRepository.clear();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    gymsRepository.create({
      id: 'gym-01',
      title: 'Star Fitness',
      description: 'Distant gym',
      phone: null,
      latitude: -30.029017,
      longitude: -51.226864,
    });

    gymsRepository.create({
      id: 'gym-02',
      title: 'Usina do Corpo Academia',
      description: 'Nearby gym',
      phone: null,
      latitude: -30.041978,
      longitude: -51.134239,
    });

    const userLatitude = -30.039006;
    const userLongitude = -51.121292;
    const { gyms } = await sut.execute({
      page: 1,
      userLatitude,
      userLongitude,
    });

    expect(gyms.length).toBe(1);
    expect(gyms).toEqual([expect.objectContaining({ id: 'gym-02' })]);
  });
});

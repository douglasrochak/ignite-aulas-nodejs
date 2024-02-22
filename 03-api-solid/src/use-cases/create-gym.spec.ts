import { expect, it, describe, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case ', () => {
  beforeEach(() => {
    gymsRepository = InMemoryGymsRepository.getInstance();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia Master',
      description: null,
      phone: null,
      latitude: -30.042043,
      longitude: -51.134154,
    });

    expect(gym.id).toBeDefined();
    expect(gym.title).toBe('Academia Master');
    expect(gym.description).toBe(null);
    expect(gym.phone).toBe(null);
  });
});

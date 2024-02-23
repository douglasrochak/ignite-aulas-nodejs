import { expect, it, describe, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = InMemoryCheckInsRepository.getInstance();
    checkInsRepository.clear();
    gymsRepository = InMemoryGymsRepository.getInstance();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('should be able to fetch check-in history', async () => {
    checkInsRepository.create({
      user_id: 'user-01',
      gym_id: `gym-01`,
    });

    checkInsRepository.create({
      user_id: 'user-01',
      gym_id: `gym-02`,
    });

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toBe(2);
  });
});

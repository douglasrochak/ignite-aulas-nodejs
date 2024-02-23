import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe('Fetch User Check-in Use Case ', () => {
  beforeEach(() => {
    checkInsRepository = InMemoryCheckInsRepository.getInstance();
    checkInsRepository.clear();
    gymsRepository = InMemoryGymsRepository.getInstance();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);

    gymsRepository.create({
      id: 'gym-01',
      title: 'Academia 01',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    });

    expect(checkIns.length).toBe(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ]);
  });

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      checkInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${i.toString().padStart(2, '0')}`,
      });
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    });

    expect(checkIns.length).toBe(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ]);
  });
});

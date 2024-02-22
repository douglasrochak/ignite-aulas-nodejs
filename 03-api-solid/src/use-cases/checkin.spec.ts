import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './checkin';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case ', () => {
  beforeEach(() => {
    checkInsRepository = InMemoryCheckInsRepository.getInstance();
    gymsRepository = InMemoryGymsRepository.getInstance();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

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

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 10, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check-in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 1, 10, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 2, 10, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check-in in distant gym', async () => {
    gymsRepository.create({
      id: 'gym-02',
      title: 'Academia 01',
      description: 'Academia 01',
      phone: '11111111111',
      latitude: new Decimal(-30.042043),
      longitude: new Decimal(-51.134154),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -30.0402567,
        userLongitude: -51.1233055,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});

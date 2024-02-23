import { Gym, Prisma } from '@prisma/client';

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { randomUUID } from 'crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
  private static instance: InMemoryGymsRepository;
  #gymsRepository: Gym[];

  private constructor() {
    this.#gymsRepository = [];
  }

  public static getInstance(): InMemoryGymsRepository {
    if (!InMemoryGymsRepository.instance) {
      InMemoryGymsRepository.instance = new InMemoryGymsRepository();
    }
    return InMemoryGymsRepository.instance;
  }

  clear() {
    this.#gymsRepository = [];
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? (randomUUID() as string),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      create_at: new Date(),
    };
    this.#gymsRepository.push(gym);

    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.#gymsRepository.find((gym) => gym.id === id);
    return gym ?? null;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const MAX_ITEMS_PER_PAGE = 20;
    return this.#gymsRepository
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE);
  }

  async findManyNearby({
    latitude,
    longitude,
    page,
  }: FindManyNearbyParams): Promise<Gym[]> {
    const MAX_ITEMS_PER_PAGE = 20;
    const MAX_DISTANCE = 10; // Kilometers
    return this.#gymsRepository
      .filter((gym) => {
        const distance = getDistanceBetweenCoordinates(
          {
            latitude: gym.latitude.toNumber(),
            longitude: gym.longitude.toNumber(),
          },
          { latitude, longitude }
        );
        return distance < MAX_DISTANCE;
      })
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE);
  }
}

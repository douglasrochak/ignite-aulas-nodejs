import { Gym, Prisma } from '@prisma/client';

import { GymsRepository } from '../gyms-repository';

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

  async create(data: Gym): Promise<Gym> {
    const gym = { ...data };
    this.#gymsRepository.push(gym);

    return gym;
  }

  async findById(id: string): Promise<{
    id: string;
    title: string;
    description: string;
    phone: string;
    latitude: Prisma.Decimal;
    longitude: Prisma.Decimal;
  } | null> {
    const gym = this.#gymsRepository.find((gym) => gym.id === id);
    return gym ?? null;
  }
}

import { Gym, Prisma } from '@prisma/client';

import { GymsRepository } from '../gyms-repository';
import { randomUUID } from 'crypto';

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
}

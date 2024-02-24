import { Gym, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }

  async searchMany(query: string, page: number) {
    const MAX_ITEMS_PER_PAGE = 20;
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: (page - 1) * MAX_ITEMS_PER_PAGE,
      take: MAX_ITEMS_PER_PAGE,
    });

    return gyms;
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const MAX_DISTANCE = 10; // in kilometers
    const nearbyGyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= ${MAX_DISTANCE}
    `;

    return nearbyGyms;
  }
}

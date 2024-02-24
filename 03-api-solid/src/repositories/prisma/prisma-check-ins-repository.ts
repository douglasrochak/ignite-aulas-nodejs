import { prisma } from '@/lib/prisma';
import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository';
import dayjs from 'dayjs';

export default class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    });
    return checkIn;
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    });

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('day');
    const endOfTheDay = dayjs(date).endOf('day');
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkIn;
  }
  async findManyByUserId(userId: string, page: number) {
    const MAX_ITEMS_PER_PAGE = 20;
    const checkIns = await prisma.checkIn.findMany({
      where: { user_id: userId },
      skip: (page - 1) * MAX_ITEMS_PER_PAGE,
      take: MAX_ITEMS_PER_PAGE,
    });

    return checkIns;
  }

  async countByUserId(userId: string) {
    const checkInCount = await prisma.checkIn.count({
      where: { user_id: userId },
    });
    return checkInCount;
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }
}

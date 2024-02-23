import { CheckIn, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { CheckInsRepository } from '../check-ins-repository';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private static instance: InMemoryCheckInsRepository;
  #checkInsRepository: CheckIn[];

  private constructor() {
    this.#checkInsRepository = [];
  }

  public static getInstance(): InMemoryCheckInsRepository {
    if (!InMemoryCheckInsRepository.instance) {
      InMemoryCheckInsRepository.instance = new InMemoryCheckInsRepository();
    }
    return InMemoryCheckInsRepository.instance;
  }

  clear() {
    this.#checkInsRepository = [];
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: data.id ?? randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.#checkInsRepository.push(checkIn);
    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<{
    id: string;
    created_at: Date;
    validated_at: Date | null;
    user_id: string;
    gym_id: string;
  } | null> {
    const startOfTheDay = dayjs(date).startOf('day');
    const endOfTheDay = dayjs(date).endOf('day');

    const checkIn = this.#checkInsRepository.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    return Promise.resolve(checkIn ?? null);
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const MAX_REGISTER_PER_PAGE = 20;
    return this.#checkInsRepository
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * MAX_REGISTER_PER_PAGE, page * MAX_REGISTER_PER_PAGE);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.#checkInsRepository.filter(
      (checkIn) => checkIn.user_id === userId
    ).length;
  }
}

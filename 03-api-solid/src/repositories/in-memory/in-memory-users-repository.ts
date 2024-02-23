import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  private static instance: InMemoryUsersRepository;
  #usersRepository: User[];

  private constructor() {
    this.#usersRepository = [];
  }

  public static getInstance(): InMemoryUsersRepository {
    if (!InMemoryUsersRepository.instance) {
      InMemoryUsersRepository.instance = new InMemoryUsersRepository();
    }
    return InMemoryUsersRepository.instance;
  }

  clear() {
    this.#usersRepository = [];
  }

  async findById(id: string): Promise<User | null> {
    const user = this.#usersRepository.find((user: User) => user.id === id);
    return user ?? null;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };
    this.#usersRepository.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.#usersRepository.find(
      (user: User) => user.email === email
    );
    return user ?? null;
  }
}

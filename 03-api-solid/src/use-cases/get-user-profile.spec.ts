import { expect, it, describe, beforeEach } from 'vitest';

import { GetUserProfileUseCase } from './get-user-profile';

import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case ', () => {
  beforeEach(() => {
    usersRepository = InMemoryUsersRepository.getInstance();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const { id: userId } = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({ userId });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to get user profile', async () => {
    expect(() =>
      sut.execute({ userId: 'invalid-user-id' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

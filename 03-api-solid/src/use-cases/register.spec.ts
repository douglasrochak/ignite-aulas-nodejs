import { expect, it, describe, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;
describe('Register Use Case ', () => {
  beforeEach(() => {
    usersRepository = InMemoryUsersRepository.getInstance();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(user.id).toBeDefined();
  });

  it('should hash user password upon registration', async () => {
    const usersRepository = InMemoryUsersRepository.getInstance();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const password = '123456';

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndow@email.com',
      password: password,
    });

    const isPasswordHashed = await compare(password, user.password_hash);
    expect(isPasswordHashed).toBe(true);
  });

  it('should not be able to register with same email', async () => {
    const usersRepository = InMemoryUsersRepository.getInstance();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = 'johndoe_unique@email.com';

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    });

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe Two',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});

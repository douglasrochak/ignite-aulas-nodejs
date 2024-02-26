import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

describe('Register Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to register', async () => {
    const response = await request(app.server).post('/register').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
  });
});

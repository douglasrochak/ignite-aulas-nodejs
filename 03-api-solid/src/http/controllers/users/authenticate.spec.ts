import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

describe('Authenticate Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to Authenticate', async () => {
    await request(app.server).post('/register').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});

import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

describe('Refresh Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to refresh token', async () => {
    await request(app.server).post('/register').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@email.com',
      password: '123456',
    });

    const cookies = authResponse.headers['set-cookie'];

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.headers['set-cookie']).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});

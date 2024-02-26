import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post('/gyms ')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Academia do Zé',
        // description: 'Some description here',
        // phone: '51999999999',
        latitude: -30.042043,
        longitude: -51.134154,
      });

    expect(response.statusCode).toBe(201);
  });
});

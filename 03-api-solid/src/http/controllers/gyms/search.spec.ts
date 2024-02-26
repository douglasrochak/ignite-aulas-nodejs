import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gyms Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms ')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Academia 01',
        latitude: -30.042043,
        longitude: -51.134154,
      });

    await request(app.server)
      .post('/gyms ')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Javascript Gym',
        latitude: -30.042043,
        longitude: -51.134154,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ q: 'Javascript' })
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym' }),
    ]);
  });
});

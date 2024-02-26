import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to search nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms ')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Academia 01',
        description: 'Nearby gym',
        latitude: -30.041978,
        longitude: -51.134239,
      });

    await request(app.server)
      .post('/gyms ')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Academia 02',
        description: 'Nearby gym',
        latitude: -30.041978,
        longitude: -51.134239,
      });

    await request(app.server)
      .post('/gyms ')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Javascript Gym',
        description: 'Distant gym',
        latitude: -30.029017,
        longitude: -51.226864,
      });

    const userLatitude = -30.039006;
    const userLongitude = -51.121292;

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ latitude: userLatitude, longitude: userLongitude })
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(2);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Academia 01' }),
      expect.objectContaining({ title: 'Academia 02' }),
    ]);
  });
});

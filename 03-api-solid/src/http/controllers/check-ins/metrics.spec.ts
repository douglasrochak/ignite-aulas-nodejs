import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Metrics Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to get metrics', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();
    const gym = await prisma.gym.create({
      data: {
        title: 'TypeScript Gym',
        latitude: -30.042043,
        longitude: -51.134154,
      },
    });

    await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        latitude: -30.042043,
        longitude: -51.134154,
      });

    await prisma.checkIn.createMany({
      data: [
        { user_id: user.id, gym_id: gym.id },
        { user_id: user.id, gym_id: gym.id },
      ],
    });

    const response = await request(app.server)
      .get('/gyms/metrics')
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.checkInsCount).toBe(3);
  });
});

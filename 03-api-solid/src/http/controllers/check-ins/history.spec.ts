import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('History Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to get history', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();
    const gym = await prisma.gym.create({
      data: {
        title: 'TypeScript Gym',
        latitude: -30.042043,
        longitude: -51.134154,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        { user_id: user.id, gym_id: gym.id },
        { user_id: user.id, gym_id: gym.id },
      ],
    });

    const response = await request(app.server)
      .get('/gyms/check-ins')
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.checkIns).toHaveLength(2);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({ user_id: user.id, gym_id: gym.id }),
      expect.objectContaining({ user_id: user.id, gym_id: gym.id }),
    ]);
  });
});

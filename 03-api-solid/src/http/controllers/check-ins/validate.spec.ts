import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';
import exp from 'constants';

describe('Validate Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();
    const gym = await prisma.gym.create({
      data: {
        title: 'TypeScript Gym',
        latitude: -30.042043,
        longitude: -51.134154,
      },
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set({ Authorization: `Bearer ${token}` })
      .send();

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: { id: checkIn.id },
    });

    expect(response.statusCode).toBe(204);
    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});

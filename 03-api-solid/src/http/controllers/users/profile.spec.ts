import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { app } from '@/app';

import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Profile Controller', () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const profileResponse = await request(app.server)
      .get('/me')
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(profileResponse.statusCode).toBe(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@email.com',
      })
    );
  });
});

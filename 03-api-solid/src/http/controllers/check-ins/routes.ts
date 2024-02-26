import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { create } from './create.controller';
import { history } from './history.controller';
import { validate } from './validate.controller';
import { metrics } from './metrics.controller';

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.post('/gyms/:gymId/check-ins', create);

  app.patch('/check-ins/:checkInId/validate', validate);

  app.get('/gyms/metrics', metrics);
  app.get('/gyms/check-ins', history);
}

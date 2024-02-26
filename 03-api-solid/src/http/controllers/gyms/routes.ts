import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { nearby } from './nearby.controller';
import { search } from './search.controller';
import { create } from './create.controller';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.post('/gyms', create);

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);
}

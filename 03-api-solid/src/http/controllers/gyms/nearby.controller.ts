import { makeFetchNearbyUseCase } from '@/use-cases/factories/make-fetch-nearby-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const fetchNearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
    page: z.coerce.number().min(1).default(1),
  });

  const { latitude, longitude, page } = fetchNearbyGymsQuerySchema.parse(
    request.query
  );

  const fetchNearbyGymsUseCase = makeFetchNearbyUseCase();

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    page,
  });

  return reply.status(200).send({ gyms });
}

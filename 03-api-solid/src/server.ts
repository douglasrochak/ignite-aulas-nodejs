import { app } from './app';
import { env } from './env';

app.get('/hello', (request, reply) => {
  reply.send({ message: 'Hello World' });
});

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running');
  });

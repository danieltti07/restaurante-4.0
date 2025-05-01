import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes';

const app = Fastify({ logger: true });

// Middleware global para tratar erros
app.setErrorHandler((error, request, reply) => {
  app.log.error(error); // loga o erro no terminal
  reply.code(400).send({ message: error.message });
});

const start = async () => {
  try {
    await app.register(cors, {
      origin: ['http://localhost:3000', 'https://restaurante-4-0-bay.vercel.app'], // Altere para seu domínio do Vercel
      credentials: true,
    });

    await app.register(routes);

    // Usa a porta do ambiente (Render fornece process.env.PORT)
    const port = Number(process.env.PORT) || 3333;

    await app.listen({ port, host: '0.0.0.0' }); // 0.0.0.0 é obrigatório no Render
    console.log(`🚀 Servidor rodando na porta ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

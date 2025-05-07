import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes';
import { Server as SocketIOServer } from 'socket.io'; // Importação corrigida para o Socket.IO

// Criação do servidor Fastify
const app = Fastify({ logger: true });

// Middleware global para tratar erros
app.setErrorHandler((error, request, reply) => {
  app.log.error(error); // Log do erro no terminal
  reply.code(400).send({ message: error.message });
});

// Inicialize o Socket.IO após registrar o WebSocket
const io = new SocketIOServer(app.server); // Instancia o servidor Socket.IO corretamente

// Quando um cliente se conectar
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Enviar mensagem de status para o cliente
  socket.emit('status', 'Servidor está funcionando');

  // Ouvir eventos enviados pelo cliente
  socket.on('sendOrderStatus', (status) => {
    console.log('Novo status do pedido recebido:', status);

    // Emitir evento para todos os clientes conectados
    io.emit('orderStatusUpdate', status);
  });

  // Quando o cliente se desconectar
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Registrar o middleware CORS
const start = async () => {
  try {
    // Registra o CORS
    await app.register(cors, {
      origin: ['http://localhost:3000', 'https://restaurante-4-0-bay.vercel.app'], // Altere para seu domínio do Vercel
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // Registra as rotas
    await app.register(routes);

    // Porta para o servidor (exemplo para ambiente de produção no Render)
    const port = Number(process.env.PORT) || 3333;

    // Inicia o servidor Fastify
    await app.listen({ port, host: '0.0.0.0' }); // 0.0.0.0 é obrigatório no Render
    console.log(`🚀 Servidor rodando na porta ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Iniciar o servidor
start();

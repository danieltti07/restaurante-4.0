import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { CreateCustomerController } from './controllers/CreateCustomerController';
import { ListCustomersController } from './controllers/ListCustomerController';
import { DeleteCustomerController } from './controllers/DeleteCustomerController';
import { LoginCustomerController } from './controllers/LoginCustomerController';
import { CreateOrderController } from './controllers/CreateOrderController';
import prismaClient from './prisma'; // ou o caminho correto para o seu arquivo prisma

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  // Rota de teste
  fastify.get('/teste', async (request: FastifyRequest, reply: FastifyReply) => {
    return { ok: true };
  });

  // Rota de criação de cliente
  fastify.post("/customers", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateCustomerController().handle(request, reply);
  });

  // Rota de listagem de clientes
  fastify.get("/customers", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListCustomersController().handle(request, reply);
  });

  // Rota de exclusão de cliente (passando id na rota)
  fastify.delete("/customer/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteCustomerController().handle(request, reply);
  });

  // Rota de login de cliente
  fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    return new LoginCustomerController().handle(request, reply);
  });

  // Rota de criação de pedido
  fastify.post("/orders", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateOrderController().handle(request, reply);
  });

  // Rota para listar os pedidos de um cliente específico
  fastify.get("/orders/:customerId", async (request: FastifyRequest, reply: FastifyReply) => {
    const { customerId } = request.params as { customerId: string };
    try {
      const orders = await prismaClient.order.findMany({
        where: { customerId },
        include: {
          items: true, // Inclui os itens do pedido
        },
      });
      return reply.status(200).send(orders);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      return reply.status(500).send({ error: "Erro ao listar pedidos" });
    }
  });

// PATCH /orders/:orderId/status
fastify.patch('/orders/:orderId/status', async (request, reply) => {
    const { orderId } = request.params as { orderId: string }
    const { status } = request.body as { status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled' }
  
    try {
      const updatedOrder = await prismaClient.order.update({
        where: { id: orderId },
        data: { status },
      })
  
      reply.send(updatedOrder)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      reply.status(500).send({ error: 'Erro ao atualizar status do pedido' })
    }
  })
  

}

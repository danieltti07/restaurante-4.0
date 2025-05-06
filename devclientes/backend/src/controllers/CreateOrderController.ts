import { FastifyRequest, FastifyReply } from "fastify";
import prismaClient from "../prisma";

export class CreateOrderController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { customerId, items } = request.body as {
      customerId: string;
      items: {
        name: string;
        price: number;
        quantity: number;
      }[];
    };

    try {
      // Criação do pedido e associação dos itens à ordem
      const order = await prismaClient.order.create({
        data: {
          customerId, // Relacionando o pedido ao cliente
          items: { // Associando os itens à ordem
            create: items.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity
            })),
          },
        },
        include: {
          items: true, // Incluindo os itens na resposta
        },
      });

      return reply.status(201).send(order); // Retorna o pedido criado com os itens
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return reply.status(500).send({ error: "Erro ao criar pedido" });
    }
  }
}

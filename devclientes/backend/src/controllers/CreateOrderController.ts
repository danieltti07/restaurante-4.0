
import { FastifyRequest, FastifyReply } from "fastify";
import prismaClient from "../prisma";

export class CreateOrderController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    // Inclua os novos campos na tipagem
    const {
      customerId,
      items,
      deliveryType,      // "delivery" | "pickup"
      paymentMethod,     // ex: "cash", "credit"
      total              // pode ser enviado OU calculado aqui
    } = request.body as {
      customerId: string;
      items: {
        name: string;
        price: number;
        quantity: number;
      }[];
      deliveryType: "delivery" | "pickup";
      paymentMethod: string;
      total?: number; // opcional se for calcular abaixo
    };

    // Se quiser calcular o total automaticamente:
    const calculatedTotal = items
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      // Criação do pedido com os campos obrigatórios
      const order = await prismaClient.order.create({
        data: {
          customerId,
          total: typeof total === "number" ? total : calculatedTotal,
          deliveryType,
          paymentMethod,
          items: {
            create: items.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return reply.status(201).send(order);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return reply.status(500).send({ error: "Erro ao criar pedido" });
    }
  }
}



import prismaClient from "../prisma";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface CreateOrderRequest {
  customerId: string;
  items: OrderItem[];
  total: number; // novo campo obrigatório por padrão do seu model
  deliveryType: "delivery" | "pickup";
  paymentMethod: string;
}

export class CreateOrderService {
  async execute({ customerId, items, total, deliveryType, paymentMethod }: CreateOrderRequest) {
    const order = await prismaClient.order.create({
      data: {
        customerId,
        total,
        deliveryType,
        paymentMethod,
        items: {
          create: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }
}

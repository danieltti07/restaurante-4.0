import prismaClient from "../prisma";

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface CreateOrderRequest {
  customerId: string
  items: OrderItem[]
}

export class CreateOrderService {
  async execute({ customerId, items }: CreateOrderRequest) {
    const order = await prismaClient.order.create({
      data: {
        customerId,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    })

    return order
  }
}

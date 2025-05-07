
import { FastifyInstance } from "fastify"
import { z } from "zod"
import prismaClient from "./prisma"

export async function ordersRoutes(app: FastifyInstance) {
  app.post("/orders", async (request, reply) => {
    const createOrderSchema = z.object({
      customerId: z.string(),
      items: z.array(
        z.object({
          productId: z.string().optional(), // if not used, can be removed
          name: z.string(),
          price: z.number(),
          quantity: z.number(),
        }),
      ),
      total: z.number(),
      deliveryType: z.enum(["delivery", "pickup"]),
      deliveryInfo: z.object({
        name: z.string(),
        phone: z.string(),
        address: z.string().optional(),
        complement: z.string().optional(),
        time: z.string(),
      }),
      paymentMethod: z.string(),
    })

    const data = createOrderSchema.parse(request.body)

    // 1. Create deliveryInfo first and get its ID
    const deliveryInfo = await prismaClient.deliveryInfo.create({
      data: {
        name: data.deliveryInfo.name,
        phone: data.deliveryInfo.phone,
        address: data.deliveryInfo.address,
        complement: data.deliveryInfo.complement,
        time: data.deliveryInfo.time,
      }
    })

    // 2. Create the Order and associate deliveryInfoId
    const order = await prismaClient.order.create({
      data: {
        customerId: data.customerId,
        total: data.total,
        status: "preparando",
        deliveryType: data.deliveryType,
        paymentMethod: data.paymentMethod,
        deliveryInfoId: deliveryInfo.id, // Associate the deliveryInfo
        items: {
          create: data.items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
        deliveryInfo: true,
      },
    })

    return reply.status(201).send(order)
  })
}


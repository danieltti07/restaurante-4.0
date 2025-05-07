
import { FastifyRequest, FastifyReply } from "fastify";
import prismaClient from "../prisma";
import bcrypt from "bcrypt";

export class LoginCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const customer = await prismaClient.customer.findUnique({
      where: { email},
      select: {
        id: true,
        name: true,
        email: true,
        password: true, // Garante que password venha
        status: true,   // Garante que status venha
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });

    if (!customer || !customer.password) {
      return reply.status(401).send({ message: "E-mail ou senha inválidos" });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return reply.status(401).send({ message: "E-mail ou senha inválidos" });
    }

    // Nunca retorne a senha!
    return reply.send({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      status: customer.status,
      role: customer.role, // Adicione o campo role aqui
    });
  }
}

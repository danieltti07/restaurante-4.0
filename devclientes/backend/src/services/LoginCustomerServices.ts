
import prismaClient from "../prisma";
import bcrypt from "bcrypt";

interface LoginCustomerRequest {
  email: string;
  password: string;
}

export class LoginCustomerService {
  async execute({ email, password }: LoginCustomerRequest) {
    const customer = await prismaClient.customer.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer || !customer.password) {
      throw new Error("E-mail ou senha inválidos");
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      throw new Error("E-mail ou senha inválidos");
    }

    // Nunca retorne a senha!
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      status: customer.status,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}

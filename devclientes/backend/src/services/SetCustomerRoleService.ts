import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

interface SetCustomerRoleProps {
  id: string;
  role: "admin" | "user";
}

class SetCustomerRoleService {
  async execute({ id, role }: SetCustomerRoleProps) {
    if (!id || !role) {
      throw new Error("ID e role são obrigatórios.");
    }
    if (role !== "admin" && role !== "user") {
      throw new Error("Role deve ser 'admin' ou 'user'.");
    }

    // Atualiza o campo role do usuário
    const updated = await prismaClient.customer.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return updated;
  }
}

export { SetCustomerRoleService };
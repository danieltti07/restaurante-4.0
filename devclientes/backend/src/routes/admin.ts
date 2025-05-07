import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

// ===== AUGMENT FASTIFY REQUEST TIPAGEM =====
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      role: string
    }
  }
}

const prisma = new PrismaClient();

/**
 * Middleware exemplo para só deixar admin acessar as rotas (simples)
 */
async function onlyAdmins(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user || request.user.role !== "admin") {
    return reply.code(403).send({ error: "Acesso permitido apenas para administradores." });
  }
}

export async function adminRoutes(app: FastifyInstance) {
  // PROMOVER para admin (PATCH /admin/promote/:id)
  app.patch('/admin/promote/:id',
    { preHandler: onlyAdmins },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        const updated = await prisma.customer.update({
          where: { id },
          data: { role: "admin" }
        })
        reply.send({ message: "Usuário promovido a admin!", user: updated })
      } catch (e) {
        reply.code(404).send({ error: "Usuário não encontrado" })
      }
    }
  )

  // REBAIXAR admin para user normal (PATCH /admin/demote/:id)
  app.patch('/admin/demote/:id',
    { preHandler: onlyAdmins },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      try {
        const updated = await prisma.customer.update({
          where: { id },
          data: { role: "user" }
        })
        reply.send({ message: "Admin rebaixado para user normal.", user: updated })
      } catch (e) {
        reply.code(404).send({ error: "Usuário não encontrado" })
      }
    }
  )

  // OPCIONAL: Listar admins
  app.get('/admin/list', { preHandler: onlyAdmins }, async (request, reply) => {
    const admins = await prisma.customer.findMany({ where: { role: "admin" } });
    reply.send(admins);
  });
}
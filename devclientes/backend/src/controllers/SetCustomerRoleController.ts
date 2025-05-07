

// src/controllers/SetCustomerRoleController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { SetCustomerRoleService } from "../services/SetCustomerRoleService";

class SetCustomerRoleController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id, role } = request.body as { id?: string, role?: "admin" | "user" };

            if (!id || !role) {
                return reply.status(400).send({ error: "ID e novo role são obrigatórios" });
            }

            const service = new SetCustomerRoleService();
            const result = await service.execute({ id, role });

            return reply.send(result);
        } catch (error: any) {
            return reply.status(500).send({ error: error.message });
        }
    }
}

export { SetCustomerRoleController };
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerServices } from "../services/createCustomerServices";

class CreateCustomerController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        try {
            // Garantir que a requisição tem body esperado
            const { name, email, phone, password } = request.body as { name?: string; email?: string, phone?: string, password?: string };

            // Validação inicial rápida
            if (!name || !email || !phone || !password) {
                return reply.status(400).send({ error: "Nome e e-mail são obrigatórios!" });
            }

            const customerServices = new CreateCustomerServices();
            const customer = await customerServices.execute({ name, email, phone, password });

            // Status 201 para criado
            reply.status(201).send(customer);
        } catch (error: any) {
            // Erro controlado pelo service
            if (error.message === "Preencha todos os campos" || error.message === "Já existe um cliente com este email") {
                return reply.status(400).send({ error: error.message });
            }

            // Erro inesperado
            console.error("Erro ao criar cliente:", error);
            reply.status(500).send({ error: "Erro interno do servidor" });
        }
    }
}

export { CreateCustomerController };
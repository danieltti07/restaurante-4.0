import { PrismaClient } from '@prisma/client'; // Importação correta
import bcrypt from "bcrypt";

const prismaClient = new PrismaClient();

interface CreateCustomerProps {
    name: string;
    email: string;
    phone: string;
    password: string;
}

class CreateCustomerServices {
    async execute({ name, email, phone, password }: CreateCustomerProps) {
        // Garantir que todos os campos foram enviados
        if (!name || !email || !phone || !password) {
            throw new Error("Preencha todos os campos");
        }

        // Verifica se já existe um cliente com este email
        const alreadyExists = await prismaClient.customer.findUnique({
            where: { email }
        });

        if (alreadyExists) {
            throw new Error("Já existe um cliente com este email");
        }

        // Criptografa a senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o novo cliente no banco de dados
        const customer = await prismaClient.customer.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                status: true, // cliente ativo por padrão
            }
        });

        // Log da informação (não logue dados sensíveis como senhas)
        console.log(`Cliente criado: ${customer.id} - ${customer.email}`);

        // Retorna os dados do cliente sem expor a senha
        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone, // Incluindo o telefone no retorno
        };
    }
}

export { CreateCustomerServices };

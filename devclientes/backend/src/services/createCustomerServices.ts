import { PrismaClient } from '../../generated/client';
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await prismaClient.customer.create({
            data: {
                name,
                email,
                phone, 
                password: hashedPassword,
                status: true,
                
                
                
                
            }
        });

        // Log a informação criada (nunca log informações sensíveis!)
        console.log(`Cliente criado: ${customer.id} - ${customer.email}`);
        return {
            id: customer.id,
            name: customer.name,
            email: customer.email
            
          };
    }
}

export { CreateCustomerServices };
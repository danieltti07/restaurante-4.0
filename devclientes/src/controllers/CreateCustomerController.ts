import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerServices} from "../services/createCustomerServices"    

class CreateCustomerController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { name, email } = request.body as { name: string; email: string }
        

    const customerServices = new CreateCustomerServices();
    const customer = await customerServices.execute({name, email})

    reply.send (customer)

    }
}    

export {CreateCustomerController}
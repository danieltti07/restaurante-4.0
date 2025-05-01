import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCustomerServices } from "../services/DeleteCustomerServices";

class DeleteCustomerController{
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const {id} = request.query as {id:string}

       const customerService = new DeleteCustomerServices();

       const customer = await customerService.execute({ id })

       reply.send(customer);
}
}
export { DeleteCustomerController }
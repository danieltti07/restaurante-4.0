import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomerServices } from "../services/ListCustomerServices";


class ListCustomersController{
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const ListCustomerService = new ListCustomerServices();

        const customers = await ListCustomerService.execute();

        reply.send(customers);

    }


}
export {ListCustomersController}
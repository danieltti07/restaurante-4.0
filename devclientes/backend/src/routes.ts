import {FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply} from 'fastify';
import { CreateCustomerController   } from './controllers/CreateCustomerController';
import { ListCustomersController } from './controllers/ListCustomerController';
import { DeleteCustomerController } from './controllers/DeleteCustomerController';
import { LoginCustomerController } from './controllers/LoginCustomerController';


export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/teste', async (request: FastifyRequest, reply:FastifyReply)=>{
        return{ok: true}
})

fastify.post("/customers", async (request: FastifyRequest, reply:FastifyReply)=>{
    return new CreateCustomerController().handle(request, reply)
})
   
fastify.get("/customers", async (request: FastifyRequest, reply:FastifyReply)=>{
    return new ListCustomersController().handle(request, reply)
 
})

fastify.delete("/customer", async (request: FastifyRequest, reply:FastifyReply)=>{
    return new DeleteCustomerController().handle(request, reply)
})

fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    return new LoginCustomerController().handle(request, reply);
})

}

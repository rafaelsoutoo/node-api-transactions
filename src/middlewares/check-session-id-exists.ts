import { FastifyRequest, FastifyReply } from 'fastify'


export async function checkSessionIdExixts(request: FastifyRequest, reply: FastifyReply) {

    const sessionId = request.cookies.sessionId

    if (!sessionId) { // se a sessionId nao existir dentro dos cookies, retorna uma resposta de erro

        return reply.status(401).send({
            error: 'Unauthorized.',
        })
    }
}
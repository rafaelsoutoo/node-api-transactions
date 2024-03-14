import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExixts } from '../middlewares/check-session-id-exists'



export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);

  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExixts], // antes de executar o handler ele irá executar o checkSessionIdExixts
    },
    async (request) => { //rota que lista todas transação

      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    })


  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExixts], // antes de executar o handler ele irá executar o checkSessionIdExixts
    },
    async (request) => {

      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { transaction }
    })


  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExixts], // antes de executar o handler ele irá executar o checkSessionIdExixts
    },
    async (request) => {   //rota pra que o usuario ver o resyumo da conta

      const { sessionId } = request.cookies


      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where('session_id', sessionId)
        .first()

      return { summary }
    })


  app.post('/', async (request, reply) => { //adicionar ao meu banco de dado 
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId //procuar dentro dos cookies se existe uma sessionId

    if (!sessionId) { // porem se nao existir, cria um novo Id de sessão
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/', // em quais endereços o cookie estrá disponivel("qlqr roto poderá")
        maxAge: 60 * 60 * 24 * 7 //7 days , qnd tempo eu quero que meu cookie expira

      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,

    })

    return reply.status(201).send()
  })
}
import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe("Transactions routes", () => {
    beforeAll(async () => { //executa algum codigo antes de todos
        await app.ready()
    })

    afterAll(async () => { //executa depos de todos 
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('o usuário consegue criar uma nova transação', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transactions',
                amount: 5000,
                type: 'credit',
            })
            .expect(201)
        //espero que a resposta do stattus seja 201

    })

    it('should be able to list all transactions', async () => {
        const createTransactionsResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transactions',
                amount: 5000,
                type: 'credit',
            })

        const cookies = createTransactionsResponse.get('Set-Cookie');

        const cookieString = Array.isArray(cookies) ? cookies.join('; ') : '';

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookieString) // Passa a string concatenada para o campo Cookie
            .expect(200);

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining(
                {
                    title: 'New transactions',
                    amount: 5000,
                }
            )
        ])
    })

    it('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })

        const cookies = createTransactionResponse.get('Set-Cookie');

        const cookieString = Array.isArray(cookies) ? cookies.join('; ') : '';

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookieString)
            .expect(200)

        const transactionId = listTransactionsResponse.body.transactions[0].id

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookieString)
            .expect(200)

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            }),
        )
    })

    it('should be able to get the summary', async () => {
        const createTransactionsResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transactions',
                amount: 5000,
                type: 'credit',
            })

        const cookies = createTransactionsResponse.get('Set-Cookie');

        const cookieString = Array.isArray(cookies) ? cookies.join('; ') : '';

        await request(app.server)
        .post('/transactions')
        .set('Cookie', cookieString) // Passa a string concatenada para o campo Cookie
        .send({
            title: 'Debit Transactions',
            amount: 2000,
            type: 'debit',
        })

        const summaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookieString) // Passa a string concatenada para o campo Cookie
            .expect(200);

        expect(summaryResponse.body.summary).toEqual({
            amount: 3000,
        })
    })
})


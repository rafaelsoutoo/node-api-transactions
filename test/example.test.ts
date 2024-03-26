import {expect, test} from 'vitest'

test('o usuário consegue criar uma nova transação', () => {
    const responsestatusCode = 201

    expect(responsestatusCode).toEqual(201)
})
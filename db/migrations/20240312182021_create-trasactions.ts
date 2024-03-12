import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("transactions", (table) => { //criação da tabela
        table.uuid('id').primary
        table.text('title').notNullable()
        table.decimal('amount',10, 2).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable
    })
}//oq ela irá fazer no banco de dados

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("transactions")
}// desfaz o compo feito pelo up


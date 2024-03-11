import {knex as setupKnex} from "knex";
// config com o banco de dados

export const knex = setupKnex({
    client: 'sqlite', //qual banco
    connection: {
        filename:'./tmp/app.db', // nome do aquivo onde sera guardado as informações(no caso de sqlite)
    }
})
import {knex as setupKnex, Knex} from "knex";
// config com o banco de dados


export const config: Knex.Config = {
        client: 'sqlite', //qual banco
        connection: {
            filename:'./db/app.db', // nome do aquivo onde sera guardado as informações(no caso de sqlite)
        },
        useNullAsDefault: true,
        migrations: {
            extension: 'ts', 
            directory: './db/migrations',// onde salvar as migrations 
        }
}

export const knex = setupKnex(config)
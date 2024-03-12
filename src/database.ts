import {knex as setupKnex, Knex} from "knex";
import { env } from "./env";
// config com o banco de dados


export const config: Knex.Config = {
        client: 'sqlite', //qual banco
        connection: {
            filename: env.DATABASE_URL, // nome do aquivo onde sera guardado as informações(no caso de sqlite)
        },
        useNullAsDefault: true,
        migrations: {
            extension: 'ts', // qual tipo 
            directory: './db/migrations',// onde salvar as migrations 
        }
}

export const knex = setupKnex(config)
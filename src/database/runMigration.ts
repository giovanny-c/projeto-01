import "reflect-metadata"
import { DataSource } from "typeorm"

//RODA AS MIGRATIONS

export const dataSource: DataSource = new DataSource({
    type: "postgres",
    host: "localhost",//tem que ser localhost para rodar as migrations
    port: +(process.env.DB_PORT),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string, //nome do banco de dados (environment POSTGRES_DB=)
    //migrationsRun: true,
    //logging: true,
    entities: [
        "./src/modules/**/entities/*.ts"
    ],
    migrations: [
        "./src/database/migrations/*.ts"
    ],




})

dataSource.initialize()





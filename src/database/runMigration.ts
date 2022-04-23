import "reflect-metadata"
import { DataSource } from "typeorm"

//RODA AS MIGRATIONS
export const dataSource: DataSource = new DataSource({
    type: "postgres",
    host: "localhost",//tem que ser localhost para rodar as migrations
    port: 5432,
    username: "docker",
    password: "1234",
    database: "projeto01_database", //nome do banco de dados (environment POSTGRES_DB=)
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





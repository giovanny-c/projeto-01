import "reflect-metadata"
import { DataSource } from "typeorm"

//CONECTA O APP COM O BD
export const dataSource: DataSource = new DataSource({
    type: "postgres",
    host: "database",
    //se for rodar o app sem o docker 
    //ou em ambiente de produção, 
    //deixar host como localhost
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


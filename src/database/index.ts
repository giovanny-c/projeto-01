import "reflect-metadata"
import { DataSource } from "typeorm"

import "dotenv/config"


//CONECTA O APP COM O BD
export const dataSource: DataSource = new DataSource({
    type: "postgres",
    host: process.env.PRODUCTION? process.env.DB_HOST : "database",
    //se for rodar o app sem o docker 
    //ou em ambiente de produção, 
    //deixar host como localhost
    //@ts-expect-error
    port: process.env.PRODUCTION? `${(+process.env.DB_MASK_PORT)}:${+(process.env.DB_PORT)}`: +(process.env.DB_PORT),
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


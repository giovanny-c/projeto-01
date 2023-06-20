
import { v4 as uuidV4 } from "uuid"
import { dataSource } from "../runMigration"
import "dotenv"

import { genPassword } from "../../utils/passwordUtils"
import { User } from "../../modules/user/entities/user"
import { error } from "pdf-lib"

async function create() {
    
    
        
    await dataSource.initialize()

    const {hash, salt} = genPassword(process.env.ADM_SEED_PASSWORD as string)
    const id =  uuidV4()
    const name = process.env.ADM_SEED_NAME 
    const email = process.env.ADM_SEED_EMAIL
    
    const adm_master = await dataSource.query(`SELECT * FROM users WHERE email = ${email}`)

    if(adm_master){
    
        throw error("User master already exists!")

    }

    await dataSource.query(
        `INSERT INTO users(id, name, email, password_hash, salt, admin, master)
        VALUES ('${id}', '${name}', '${email}', '${hash}', '${salt}', true, true)
        `
    )
    
    
    

    
}


create()
.then(() => {
    console.log("User admin master created!")
}).catch((error) => {
    console.error(error)
}).finally(() =>{
    dataSource.destroy()
})
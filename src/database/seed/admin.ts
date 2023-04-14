
import { v4 as uuidV4 } from "uuid"
import { dataSource } from "../runMigration"
import "dotenv"

import { genPassword } from "../../../utils/passwordUtils"
import { User } from "../../modules/user/entities/user"

async function create() {
    
    
        
    await dataSource.initialize()

    const {hash, salt} = genPassword(process.env.ADM_SEED_PASSWORD as string)
    const id =  uuidV4()
    const name = process.env.ADM_SEED_NAME 
    const email = process.env.ADM_SEED_EMAIL
    
    await dataSource.query(
        `INSERT INTO users(id, name, email, password_hash, salt, admin, master)
        VALUES ('${id}', '${name}', '${email}', '${hash}', '${salt}', true, true)
        `
    )
    
    dataSource.destroy()
    

    
}


create().then(() => console.log("User admin created!")).catch(console.error)
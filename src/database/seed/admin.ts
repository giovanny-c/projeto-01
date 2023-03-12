
import { v4 as uuidV4 } from "uuid"
import { dataSource } from ".."
import "dotenv"

import { genPassword } from "../../../utils/passwordUtils"
import { User } from "../../modules/user/entities/user"

async function create() {
    const repository = dataSource.getRepository(User)

    const {hash, salt} = genPassword(process.env.ADM_SEED_PASSWORD as string)
    
    const userMaster = repository.create({
        id: uuidV4(),
        name: process.env.ADM_SEED_NAME as string,
        admin: true,
        email: process.env.ADM_SEED_EMAIL as string,
        password_hash: hash,
        salt
        
    })

    repository.save(userMaster).then()
    

    
}


create().then(() => console.log("User admin created!")).catch(console.error)
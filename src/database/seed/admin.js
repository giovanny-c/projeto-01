// const { v4: uuidV4 } = require("uuid")
// const dataSource = require("../../")
// const genPassword = require("../../../utils/passwordUtils")
// const { User } = require("../../modules/user/entities/user")
// require("dotenv")

// async function create() {
//     const repository = dataSource.getRepository(User)

//     const { hash, salt } = genPassword(process.env.ADM_SEED_PASSWORD)

//     const userMaster = repository.create({
//         id: uuidV4(),
//         name: process.env.ADM_SEED_NAME,
//         admin: true,
//         email: process.env.ADM_SEED_EMAIL,
//         password_hash: hash,
//         salt
//     })

//     repository.save(userMaster).then()



// }


// create().then(() => console.log("User admin created!")).catch(console.error)
import * as crypto from "crypto"



function genPassword(password: string) {

    const salt = crypto.randomBytes(32).toString("hex")
    const generateHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")

    return {
        salt,
        hash: generateHash
    }
}


function validatePassword(password: string, salt: string, hash: string): boolean {

    const hashVerify = crypto.pbkdf2Sync(password as string, salt, 10000, 64, "sha512").toString("hex")

    return hash === hashVerify // se retornar false = senha invalida
}



export { genPassword, validatePassword }
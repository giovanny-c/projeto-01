import * as crypto from "crypto"

import "dotenv"

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


function encrypt(content: string){


    const initVector = process.env.INIT_VECTOR
    const securityKey = process.env.SECURITY_KEY
    const algorithm = process.env.ENCRYPT_ALGORITHM


    const cipher = crypto.createCipheriv(algorithm, securityKey, initVector)
    
    let encryptedContent = cipher.update(content, "utf-8", "hex")
    
    
    return encryptedContent += cipher.final("hex")

} 

function decrypt(content: string){

    const initVector = process.env.INIT_VECTOR
    const securityKey = process.env.SECURITY_KEY
    const algorithm = process.env.ENCRYPT_ALGORITHM

    const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector)

    let decryptedContent = decipher.update(content, "hex", "utf-8")
    
    return decryptedContent += decipher.final("utf-8")

 

}





export { genPassword, validatePassword, encrypt, decrypt }
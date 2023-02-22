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

function encodePasswordForEmail(password: string){
    
    let bufferPass = Buffer.from(password)

    return bufferPass.toString("base64")
    
}

function decodePasswordForEmail(encodePassword: string){

    let bufferPass = Buffer.from(encodePassword)

    return bufferPass.toString("ascii")

}


function validatePassword(password: string, salt: string, hash: string): boolean {

    const hashVerify = crypto.pbkdf2Sync(password as string, salt, 10000, 64, "sha512").toString("hex")

    return hash === hashVerify // se retornar false = senha invalida
}



export { genPassword, validatePassword, encodePasswordForEmail, decodePasswordForEmail }

import multer from "multer"

import * as crypto from "crypto"

import { resolve } from "path"

const tmpFolder = resolve(__dirname, "..", "..", "tmp")



export default {
    tmpFolder, // pasta onde será salvo os arquivos

    storage: multer.diskStorage({//aonde será salvo os arquivos que vierem do multer

        destination: tmpFolder,// destino,

        filename: (request, file, callback) => {
            const fileHash = crypto.randomBytes(16).toString("hex")

            const fileName = `${fileHash}-${file.originalname}`

            return callback(null, fileName)
        }
    })
}
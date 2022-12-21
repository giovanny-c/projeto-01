import upload from "@config/upload";
import * as fs from "fs"
import * as mime from "mime"
import { resolve } from "path";
import { IFilePath, IStorageProvider } from "../IStorageProvider";


class LocalStorageProvider implements IStorageProvider {

    async save({ file, folder }: IFilePath): Promise<string> {
        try {


            //let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo

            let dir = `${upload.tmpFolder}/${folder}`
            //ver se funciona 
            //let dir = resolve(`${upload.tmpFolder}/${folder}`)

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }

            fs.renameSync( //poe o file outro lugar
                resolve(upload.tmpFolder, file),
                resolve(dir, file)
            )

            return file

        } catch (error) {
            throw error
        }
    }

    async delete({ file, folder }: IFilePath): Promise<void> {

        try {

            //let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo ( o nome do arquivo salvo no bd)

            let dir = `${upload.tmpFolder}/${folder}`

            const file_name = resolve(dir, file)

            try { //se nao existir o arquivo retorn a func
                fs.statSync(file_name)
            } catch {
                return
            }

            fs.unlinkSync(file_name)

            let files = fs.readdirSync(dir)

            if (!files.length) {
                fs.rmdirSync(dir)
            }

        } catch (error) {
            throw error
        }

    }

}

export { LocalStorageProvider }
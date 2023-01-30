
import * as fs from "fs"
import * as path from "path"
import * as mime from "mime"
import { resolve } from "path";
import upload from "../../../../../config/upload";
import { AppError } from "../../../../errors/AppError";
import { IFilePath, IStorageProvider } from "../IStorageProvider";
import { getExecutionTime } from "../../../../../../utils/decorators/executionTime";


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

    @getExecutionTime()
    async saveFileReceipt(dir: string, file_name:string, file: Uint8Array ): Promise<void>{
        

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        fs.writeFile(`${dir}/${file_name}`, file,
            (err) => {
                if (err) throw err
        })  



    }

    @getExecutionTime()
    async getFile(dir: string, file_name: string, returnInBase64: boolean): Promise<Buffer | string | void>{

        let file_path = `${dir}/${file_name}`

        let file
        
        try {   

            file = fs.readFileSync(file_path)

            
            if(returnInBase64){

                return file.toString("base64")
            }
            
            return file

        } catch (error) {

            return
        }
    }


    getFileStream(dir: string, file_name: string): string{

        let data: string

        const readStream = fs.createReadStream(`${dir}/${file_name}`, "base64")
        readStream.on("error", (error) => {
            console.error(error)
            throw new AppError("Nao foi possivel ler o arquivo", 500)})
        readStream.on("data", (chunk) => data += chunk)
        readStream.on("end", () => console.log("stream ended"))
        
        return data
    }

   

    async getFilesFromDir(dir: string): Promise<string[] | void>{
        
        let content

        try {   

            content = fs.readdirSync(dir)

            return content
            
        } catch (error) {

            return
        }
    }

    // async getLastCreatedFile(dir){

    //     const result = fs.readdirSync(dir)
    //     .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
    //     .map((file) => ({file, mtime: fs.lstatSync(path.join(dir, file)).mtime}))
    //     .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())[0]
        
    //     return result
    // }

}

export { LocalStorageProvider }
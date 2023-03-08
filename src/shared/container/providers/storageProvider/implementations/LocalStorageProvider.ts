
import * as fs from "fs"
import * as fsPromises from "fs/promises"
import * as path from "path"
import * as mime from "mime"
import { resolve } from "path";
import upload from "../../../../../config/upload";
import { AppError } from "../../../../errors/AppError";
import { IFilePath, IStorageProvider } from "../IStorageProvider";
import { getExecutionTime } from "../../../../../../utils/decorators/executionTime";


class LocalStorageProvider implements IStorageProvider {
    
    //pega do tmp folde (multer)
    async save({ file, folder }: IFilePath): Promise<string> {
        try {


            //let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo

            let dir = `${upload.tmpFolder}/${folder}`
            //ver se funciona 
            //let dir = resolve(`${upload.tmpFolder}/${folder}`)

            if (!fs.existsSync(dir)) {
                fs.mkdir(dir, { recursive: true },
                    (err) => {
                        if (err) throw err
                    }    
                )
            }

            fs.rename( //poe o file outro lugar
                resolve(upload.tmpFolder, file),
                resolve(dir, file),
                (err) => {
                    if (err) throw err
                }
            )

            return file

        } catch (error) {
            throw error
        }
    }
    // do tmp folder do multer
    async delete({ file, folder }: IFilePath): Promise<void> {

        try {

            //let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo ( o nome do arquivo salvo no bd)

            let dir = `${upload.tmpFolder}/${folder}`

            const file_name = resolve(dir, file)

            try { //se nao existir o arquivo retorn a func
                fs.stat(file_name,
                    (err) => {
                        if(err) throw err
                })
            } catch {
                return
            }

            fs.unlink(file_name,  (err) => {
                if(err) throw err
            })

            let files = fs.readdirSync(dir)

            if (!files.length) {
                fs.rmdir(dir,  (err) => {
                    if(err) throw err
                })
            }

        } catch (error) {
            throw error
        }

    }

    @getExecutionTime() //transformar em fsPromise?
    async saveFileReceipt(dir: string, file_name:string, file: Uint8Array ): Promise<void>{

        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, { recursive: true },(err) =>  {if (err)throw err})
  
        }

        try { 
           fs.writeFile(`${dir}/${file_name}`, file,
                    (err) => {
                        if (err) throw err
            })
        } catch (error) {
            throw error
        }   
            



    }

    @getExecutionTime() //await asyncrono tem que escrever tudo para que o getFile consiga pegar sem erros
    async saveFileBooklet(dir: string, file_name:string, file: Uint8Array ): Promise<void>{

        if (!fs.existsSync(dir)) {
            await fsPromises.mkdir(dir, { recursive: true })
                //  (err) => {if (err) throw err}
            
        }

        //fsPromise.writeFile lento porem consegue escrever
        try { 
            await fsPromises.writeFile(`${dir}/${file_name}`, file)
            /*,
                    (err) => {
                        if (err) throw err
                }*/  
        } catch (error) {
            throw error
        }   
            



    }

    @getExecutionTime()
    async getFile(dir: string, file_name: string, returnInBase64: boolean): Promise<Buffer | string | void>{

        let file_path = `${dir}/${file_name}`

        let file
        
        try {   

            file = await fsPromises.readFile(file_path)

            
            if(returnInBase64){

                return file.toString("base64")
            }
            
            return file
            
        } catch (error) {
            
            return
        }
    }
    
    
    async getFilesFromDir(dir: string): Promise<string[] | void>{
        
        let content
        
        try {   

            content = await fsPromises.readdir(dir)
            
            return content
            
        } catch (error) {
            
            return
        }
    }
    

    getFileStream(dir: string, file_name: string): string{
        
        let data: string

        const readStream = fs.createReadStream(`${dir}/${file_name}`, "base64")
        
        readStream.on("error", (error) => {
            if (error) {
            console.error(error)
            throw new AppError("Nao foi possivel ler o arquivo", 500)}
        })

        readStream.on("data", (chunk) => data += chunk)
        readStream.on("end", () => console.log("stream ended"))
        
        return data
    }
          
    @getExecutionTime()
    saveFileStream(dir: string, file_name: string, file: Uint8Array | Buffer){

        const stream = fs.createWriteStream(`${dir}/${file_name}`)

        stream.write(file, (err) => {
            if (err) throw err
        })
        stream.end()
        
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

import * as fs from "fs"
import * as fsPromises from "fs/promises"
import * as util from "util"
import * as stream from "stream"
import { resolve } from "path";
import upload from "../../../../../config/upload";
import { AppError } from "../../../../errors/AppError";
import { IFilePath, IStorageProvider } from "../IStorageProvider";
import { getExecutionTime } from "../../../../../../utils/decorators/executionTime";
import {once} from "events"
import * as zlib from "zlib"

class LocalStorageProvider implements IStorageProvider {
    
    //pega do tmp folde (multer)
    async saveFromTmpFolder({ file, folder }: IFilePath): Promise<string> {
        try {


            //let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo

            let dir = resolve(upload.tmpFolder, folder)
            //ver se funciona 
            //let dir = resolve(`${upload.tmpFolder}/${folder}`)

            if (!fs.existsSync(dir)) {
                fs.mkdir(dir, { recursive: true },
                    (err) => {
                        if (err) {
                            console.error(err)
                            throw new AppError("Não foi possivel salvar arquivo.")
                    }}    
                )
            }

            fs.rename( //poe o file outro lugar
                resolve(upload.tmpFolder, file),
                resolve(dir, file),
                (err) => {
                    if (err) {
                        console.error(err)
                        throw new AppError("Não foi possivel salvar arquivo.")
                    }
                }
            )

            return file

        } catch (error) {
            
            console.error(error)
            throw new AppError("Não foi possivel salvar arquivo.")
        
        }
    }
    // do tmp folder do multer
    async deleteFromTmpFolder({ file, folder }: IFilePath): Promise<void> {

        try {

            //let [, file_type] = file.split(/\.(?!.*\.)/, 2) // separa no ultimo ponto para pegar o tipo do arquivo ( o nome do arquivo salvo no bd)

            let dir = resolve(upload.tmpFolder, folder)

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
    saveAsync(dir: string, file_name:string, file: Uint8Array ): void{

        

        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, { recursive: true },(err) => {if (err) {
                
                console.error(err)
                throw new AppError("Não foi possivel salvar arquivo.")

            }})
  
        }

        const file_path = resolve(dir, file_name)

        fs.writeFile(file_path, file,
                (err) => {
                    if (err) {
                        console.error(err)
                        throw new AppError("Não foi possivel salvar arquivo!")

                }

        })
        
            



    }

    @getExecutionTime() //await asyncrono tem que escrever tudo para que o getFile consiga pegar sem erros
    async saveSync(dir: string, file_name:string, file: Uint8Array ): Promise<void>{


        try { 

            if (!fs.existsSync(dir)) {
                await fsPromises.mkdir(dir, { recursive: true })
                    //  (err) => {if (err) throw err}
                
            }

            const file_path = resolve(dir, file_name)
        //fsPromise.writeFile lento porem consegue escrever
            await fsPromises.writeFile(file_path, file)
            /*,
                    (err) => {
                        if (err) throw err
                }*/  
        } catch (error) {
            console.error(error)
            throw new AppError("Não foi possivel salvar arquivo.")

        }   
            



    }

    @getExecutionTime()
    async getFile(dir: string, file_name: string, returnInBase64?: boolean): Promise<Buffer | string | void>{

        
 
        try {   
            const file_path = resolve(dir, file_name)

            
            const file = await fsPromises.readFile(file_path, {
                encoding: returnInBase64 ? "base64" : null 
            })


            return file
            
        } catch (error) {
            
            console.error(error)
            // throw new AppError("Não foi possivel ler o arquivo, ou ele nao existe.")
        }
    }
    
    
    async getFileNamesFromDir(dir: string): Promise<string[] | void>{
        
        let content
        
        try {   

            content = await fsPromises.readdir(dir)
            
            return content
            
        } catch (error) {
            
            return
        }
    }

    deleteFile(dir: string, file_name: string){

        const file_path = resolve(dir, file_name)

            try { //se nao existir o arquivo retorn a func
                fs.stat(file_path,
                    (err) => {
                        if(err) {
                            console.error(err)
                            return
                        }
                })
            } catch {
                return
            }

            //
            fs.unlink(file_path,  (err) => {
                if(err) {
                    console.error(err) 
                    return
                }
            })

    }
    

    async getFileStream(dir: string, file_name: string): Promise<string>{
        
        let data = ""

        const file_path = resolve(dir, file_name)

        try {
            
            await new Promise((resolve) => {
                
                fs.createReadStream(file_path, "base64")
                .on("error", (error) => {
                    if (error) {
                        console.error(error)
                    }
                })
                .on("data", (chunk) => {
                    data += chunk
                    
                   
                })
                .on("end", resolve)
            
                
            })

        } catch (error) {
            throw new AppError("Não foi possível ler o arquivo")
        }


        return data
    }
          
    @getExecutionTime()
    saveFileStream(dir: string, file_name: string, file: Uint8Array | Buffer){

        const file_path = resolve(dir, file_name)

        const stream = fs.createWriteStream(file_path)

        stream.write(file, (err) => {
            if (err) {
                console.error(err)
                throw new AppError("Não foi possível salvar o arquivo")
        }})
        
        
        
    }

    saveAndCompressFile(dir: string, file_name: string, readable: Uint8Array | Buffer | string){

        const file_path = resolve(dir, file_name + ".gz")

        zlib.createGzip().end(Buffer.from(readable))
        .pipe(fs.createWriteStream(file_path))
        .on("error", (err)=> {
            console.error(err)
                
            throw new AppError("Não foi possível salvar o arquivo")
        })


       
        
        
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
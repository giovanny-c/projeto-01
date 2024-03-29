import {  injectable } from "tsyringe";
import * as fs from "fs"
import { AppError } from "../../../../shared/errors/AppError";
import {resolve} from "path"

@injectable()
class StreamFileUseCase {


    async execute(file_path: string): Promise<fs.ReadStream | void>{
        
        
        try {

            if(!file_path.match(/(tmp)|(examples)/)){
                throw new Error("O caminho do arquivo esta incorreto")
            }
            
            await fs.promises.access(file_path)
    
            
            const readable = fs.createReadStream(resolve(file_path))
            
      
            return readable
               

        } catch (error) {
            
            console.error(error)


        }





    }
}

export {StreamFileUseCase}
import { inject, injectable } from "tsyringe";
import * as fs from "fs"
import { AppError } from "../../../../shared/errors/AppError";
import {resolve} from "path"

@injectable()
class StreamFileUseCase {


    async execute(file_path: string): Promise<fs.ReadStream | void>{
        
        
        try {
            
            await fs.promises.access(file_path)
    
            
            const readable = fs.createReadStream(resolve(file_path))
            
            // readable.on("data", (chunck) => {
            //     console.log(chunck.slice(0,1))
            // })
            
            return readable
               

        } catch (error) {
            
            console.error(error)


        }





    }
}

export {StreamFileUseCase}
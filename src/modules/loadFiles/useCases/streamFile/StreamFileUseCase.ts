import { inject, injectable } from "tsyringe";
import * as fs from "fs"
import { AppError } from "../../../../shared/errors/AppError";
import {resolve} from "path"

@injectable()
class StreamFileUseCase {


    async execute(file_path: string){
        try {
            
            await fs.promises.access(file_path)
        } catch (error) {
            console.error(error)

            throw new AppError("Não foi possivel ler o arquivo", 500)

        }


        
        const readable = fs.createReadStream(resolve(file_path))
        
        // readable.on("data", (chunck) => {
        //     console.log(chunck.slice(0,1))
        // })
        
        return readable




    }
}

export {StreamFileUseCase}
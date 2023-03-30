import { inject, injectable } from "tsyringe";
import * as fs from "fs"
import { AppError } from "../../../../shared/errors/AppError";

@injectable()
class StreamFileUseCase {


    execute(file_path: string){
        try {
            
            fs.promises.access(file_path)
        } catch (error) {
            console.error(error)

            throw new AppError("Não foi possivel ler o arquivo", 500)

        }

        return fs.createReadStream(file_path, "base64")


    }
}

export {StreamFileUseCase}
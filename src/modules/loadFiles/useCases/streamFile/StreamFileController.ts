import {Request, Response} from "express"
import {container} from "tsyringe"
import { StreamFileUseCase } from "./StreamFileUseCase"

class StreamFileController {


    async handle(req: Request, res: Response){
        
        const {path} = req.query

        const file_name = path.toString().match(/([^<>:"\/\\|?*]+\.\w+)/g) 

        const streamFile = container.resolve(StreamFileUseCase)

        const file = streamFile.execute(path as string)

        // res.type("pdf")
        // res.set("Content-Disposition", `attachment; filename=${file_name}`)

        file.pipe(res)
    }

}

export {StreamFileController}
import {Request, Response} from "express"
import {container} from "tsyringe"
import { StreamFileUseCase } from "./StreamFileUseCase"
import {extname} from "path"

class StreamFileController {


    async handle(req: Request, res: Response){
        
        const {path, file_name} = req.query

        const extension = extname(path as string) 

        const streamFile = container.resolve(StreamFileUseCase)

        const file = await streamFile.execute(path as string)
console.log(file_name)
        //res.type("pdf")
        //inline = mostra no browser
        //attachment= download auto
        res.set("Content-Disposition", `inline; filename=${file_name}${extension}`)

        file.pipe(res)
        // .on("finish", () => {
        //     console.log("finish")
        // })
    }

}

export {StreamFileController}
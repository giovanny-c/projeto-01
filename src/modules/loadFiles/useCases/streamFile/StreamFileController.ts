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

        //res.type("pdf")
        //inline = mostra no browser
        //attachment= download auto
    
        if(file){
            
            res.set("Content-Disposition", `inline; filename=${file_name}${extension}`)
            file.pipe(res)

        }else{
            
            let style = "color: white; text-align: center; font: caption; font-size: 40px"
            
            return res.status(404).send(`<p style="${style}">404</p><p style="${style}">Não foi possível ler o arquivo ou ele não existe.</p>`)

        }


      
    }

}

export {StreamFileController}
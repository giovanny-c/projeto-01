import {Request, Response} from "express"
import {container} from "tsyringe"
import {extname} from "path"
import { error } from "pdf-lib"
import { GenerateFileUseCase } from "./GenerateFileUseCase"

class GenerateFileController {


    async handle(req: Request, res: Response){
        
        const {file: file_type} = req.params
        
        const params = req.body

        const generateFile = container.resolve(GenerateFileUseCase)

        const response = await generateFile.execute(file_type, params)

        
        //res.type("pdf")
        //inline = mostra no browser
        //attachment= download auto

        
    
        if(response){
            
            
            // res.set("Content-Disposition", `inline; filename=${file_name}`)
            response.pipe(res)

        }else{
            

            let style = "color: white; text-align: center; font: caption; font-size: 40px"
            
            return res.status(404).send(`<p style="${style}">404</p><p style="${style}">Não foi possível ler o arquivo ou ele não existe.</p>`)

        }


    
    }

}

export {GenerateFileController}
import {Request, Response} from "express"
import {container} from "tsyringe"
import {extname} from "path"
import { error } from "pdf-lib"
import { GenerateFileUseCase } from "./GenerateFileUseCase"

class GenerateFileController {


    async handle(req: Request, res: Response){
        
        const {file} = req.params
        
        let params = req.body
        
       
       if(Object.keys(params).length === 0){

        params = req.query

       }

      
        const generateFile = container.resolve(GenerateFileUseCase)

        const response = await generateFile.execute({file, params})

        
        if(response){
            
            res.set("Content-Disposition", `inline; filename=${response.file_name}`)
            res.set('Content-Type', "application/pdf")
            response.readable.pipe(res)

        }else{
            
            
            let style = "color: white; text-align: center; font: caption; font-size: 40px"
            
            let html =  `<p style="${style}">404</p><p style="${style}">Não foi possível gerar o arquivo.</p>`

            return res.status(404).send(html)

        }


    
    }

}

export {GenerateFileController}
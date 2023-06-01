import {Request, Response} from "express"
import {container} from "tsyringe"
import { GenerateFileUseCase } from "./GenerateFileUseCase"


class GenerateFileController {


    async handle(req: Request, res: Response){
        
        const {file} = req.params
        
        let params = req.body

       if(Object.keys(req.body).length === 0){
        //se a rota for get
        params = req.query

       }

      
        const generateFile = container.resolve(GenerateFileUseCase)

        const result = await generateFile.execute({file, params })

        

        
        let style = "color: white; text-align: center; font: caption; font-size: 40px"
        
        let html =  `<p class="error" style="${style}">Erro: 500</p><p class="error" style="${style}">Não foi possível gerar o arquivo.</p>`
        
        if(!result){
            
            if(Object.keys(req.body).length){

                return res.status(result.error.status).send(result.error.message)
                
            }
             
            return res.status(500).send(html)
        }
        if(result.error){

            html =  `<p class="error" style="${style}">Erro: ${result.error.status}</p><p class="error" style="${style}">${result.error.message}</p>`
            
            if(Object.keys(req.body).length > 1){

                return res.status(result.error.status).send(result.error.message)
                
            }
            

            return res.status(result.error.status).send(html)
            
            
        }
        if(result.response){
            
            res.set("Content-Disposition", `inline; filename=${result.response.file_name}`)
            res.set('Content-Type', "application/pdf")
            res.status(201)

            try {
                result.response.readable.pipe(res)
            
            } catch (error) {

                html =  `<p class="error" style="${style}">Erro: ${result.error.status}</p><p class="error" style="${style}">${result.error.message}</p>`
                
                if(Object.keys(req.body).length){

                    return res.status(result.error.status).send(html)
                    
                }


                return res.status(500).send(html)
            
            }
            
            

        }


    
    }

}

export {GenerateFileController}
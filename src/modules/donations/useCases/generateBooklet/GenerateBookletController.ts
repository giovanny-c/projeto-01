import { Request, Response } from "express";

import { container } from "tsyringe";
import { GenerateBookletUseCase } from "./GenerateBookletUseCase";


class GenerateBookletController {

    async handle(req: Request, res: Response){

        const {initial_number, final_number} = req.body
        const {ngo_id} = req.params



        const generateBooklet = container.resolve(GenerateBookletUseCase)

        try {

            const {content_type, file, file_name} = await generateBooklet.execute({donation_number_interval: [+(initial_number),  +(final_number)], ngo_id})
            
        
            res.set("Content-Disposition", `inline; filename=${file_name}`)
            res.set('Content-Type', content_type)
            res.status(201)

        

            file.pipe(res)
            
            
        
        } catch (error) {

            console.error(error)

            res.status(error.statusCode || 500)
            res.send(error.message || error)
            // throw new AppError("Um erro aconteceu a gerar o arquivo", 500)  
            
        }
        
            

        }


    
    } 




export{GenerateBookletController}
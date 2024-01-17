import { Request, Response } from "express";

import { container } from "tsyringe";
import { GenerateBookletUseCase } from "./GenerateBookletUseCase";


class GenerateBookletController {

    async handle(req: Request, res: Response){

        
        try {

            const {initial_number, final_number, data_de_inicio, data_de_termino} = req.body
            const {ngo_id} = req.params



            const generateBooklet = container.resolve(GenerateBookletUseCase)

        
            console.log(req.body)

            const {content_type, file, file_name} = await generateBooklet.execute({
                donation_number_interval: [+(initial_number),  +(final_number)], 
                ngo_id, 
                date_interval: {startDate: data_de_inicio as string, endDate: data_de_termino as string
            }})

            
        
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
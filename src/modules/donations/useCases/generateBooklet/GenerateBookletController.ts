import { Request, Response } from "express";

import { container } from "tsyringe";
import { GenerateBookletUseCase } from "./GenerateBookletUseCase";
import { AppError } from "../../../../shared/errors/AppError";


class GenerateBookletController {

    async handle(req: Request, res: Response){

        const {first_number, last_number} = req.body
        const {ngo_id} = req.params

        const generateBooklet = container.resolve(GenerateBookletUseCase)

        const {content_type, file, file_name} = await generateBooklet.execute({donation_number_interval: [+(first_number),  +(last_number)], ngo_id})
        

            
            res.set("Content-Disposition", `attachment; filename=${file_name}`)
            res.set('Content-Type', content_type)
            res.status(201)

            try {

                file.pipe(res)
            
            } catch (error) {

                console.error(error)
                throw new AppError("Um erro aconteceu a gerar o arquivo", 500)  
              
            }
            
            

        }


    
    } 




export{GenerateBookletController}
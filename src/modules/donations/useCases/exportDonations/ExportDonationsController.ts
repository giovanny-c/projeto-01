import { Request, Response } from "express";
import { container } from "tsyringe";
import { ExportDonationsUseCase } from "./ExportDonationsUseCase";




class ExportDonationsController {


    async handle(req: Request, res: Response){
        
        try {
            const {ngo_id} = req.params 

            const {initial_number, final_number, data_de_inicio, data_de_termino} = req.body
            
            const ExportDonations = container.resolve(ExportDonationsUseCase)

        
        
            const {file, file_name} = await ExportDonations.execute({
                ngo_id,
                donation_number_interval: [+(initial_number), +(final_number)],
                date_interval: {startDate: data_de_inicio as string, endDate: data_de_termino as string}
            })


            res.set("Content-Disposition", `inline; filename=${file_name}`)
            res.status(201)


            file.pipe(res)

        } catch (error) {
            

            console.error(error)

            res.status(error.statusCode || 500)
            res.send(error.message || error)

        }

        

    }

}

export {ExportDonationsController}
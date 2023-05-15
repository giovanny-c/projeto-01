import { Request, Response } from "express";
import { container } from "tsyringe";
import { ExportDonationsUseCase } from "./ExportDonationsUseCase";




class ExportDonationsController {


    async handle(req: Request, res: Response){

        const {ngo_id} = req.params 

        let donation_number_interval

        // if(req.query){
        //     const {initial_number, final_number} = req.query

        //     donation_number_interval = [+(initial_number), +(final_number)]
        // }

        // if(req.body){

        const {initial_number, final_number} = req.body
        
        donation_number_interval = [+(initial_number), +(final_number)]
        // }


        const ExportDonations = container.resolve(ExportDonationsUseCase)

        const {file, file_name} = await ExportDonations.execute({
            ngo_id, 
            donation_number_interval })

        res.set("Content-Disposition", `attachment; filename=${file_name}`)
        // res.set('Content-Type', "application/pdf")
        res.status(201)


        file.pipe(res)

        // res.on("finish", ()=> {
        //     console.log(res)
        // })
        

        

    }

}

export {ExportDonationsController}
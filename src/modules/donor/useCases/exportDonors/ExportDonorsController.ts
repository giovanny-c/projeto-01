import { Request, Response } from "express";
import { container } from "tsyringe";
import { ExportDonorsUseCase } from "./ExportDonorsUseCase";





class ExportDonorsController {


    async handle(req: Request, res: Response){
        
        try {
            
            const exportDonors = container.resolve(ExportDonorsUseCase)
            
            const {file, file_name} = await exportDonors.execute({ user: req.user})

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

export {ExportDonorsController}
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ExportDonationsUseCase } from "./ExportDonationsUseCase";




class ExportDonationsController {


    async handle(req: Request, res: Response){


        const ExportDonations = container.resolve(ExportDonationsUseCase)

        const file = await ExportDonations.execute()

        res.set("Content-Disposition", `attachment; filename=donations.xlsx`)
        // res.set('Content-Type', "application/pdf")
        res.status(201)

        file.pipe(res)


    }

}

export {ExportDonationsController}
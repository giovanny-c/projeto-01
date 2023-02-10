import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadImportDonationsUseCase } from "./LoadImportDonationsUseCase";





class LoadImportDonationsController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params

        

        const loadImportDonations = container.resolve(LoadImportDonationsUseCase)

        const {ngo} = await loadImportDonations.execute({ngo_id})

        return res.status(200).render("views/donations/import-donations", {ngo, error: req.error})

    }


}

export { LoadImportDonationsController}
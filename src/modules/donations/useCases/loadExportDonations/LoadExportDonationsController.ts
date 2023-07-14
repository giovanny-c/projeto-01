import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadExportDonationsUseCase } from "./LoadExportDonationsUseCase";





class LoadExportDonationsController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params

        const loadExportDonations = container.resolve(LoadExportDonationsUseCase)

        const {ngo} = await loadExportDonations.execute({ngo_id})
            
        return res.status(200).render("views/donations/export-donations", {ngos: req.ngos, ngo, username: req.user.name, error: req.error, success: req.success})

    }


}

export { LoadExportDonationsController}
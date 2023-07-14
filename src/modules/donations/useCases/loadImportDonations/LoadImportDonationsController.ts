import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadImportDonationsUseCase } from "./LoadImportDonationsUseCase";





class LoadImportDonationsController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params

        

        const loadImportDonations = container.resolve(LoadImportDonationsUseCase)

        const {ngo, file_path, file_name} = await loadImportDonations.execute({ngo_id})

        return res.status(200).render("views/donations/import-donations", {ngos: req.ngos, ngo, file_path, file_name, username: req.user.name, error: req.error, success: req.success})

    }


}

export { LoadImportDonationsController}
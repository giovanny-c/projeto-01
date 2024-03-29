
import { Request, Response } from "express"
import { container } from "tsyringe"
import { LoadUpdateDonationUseCase } from "./LoadUpdateDonationUseCase"




class LoadUpdateDonationController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id, donation_number } = req.params
        
        const loadCreateDonation = container.resolve(LoadUpdateDonationUseCase)

        const {ngo, donation, workers, date} = await loadCreateDonation.execute({ngo_id, donation_number: +(donation_number)})

        return res.status(200).render("views/donations/update-donation", {ngos: req.ngos, ngo, workers, donation, date, username: req.user.name, error: req.error, success: req.success})

    }

}

export {LoadUpdateDonationController}
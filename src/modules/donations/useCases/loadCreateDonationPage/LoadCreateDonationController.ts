import { Request, Response } from "express"
import { container } from "tsyringe"
import { LoadCreateDonationUseCase } from "./LoadCreateDonationUseCase"



class LoadCreateDonationController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id: id } = req.params
        const {id: user_id} = req.user
        
        const loadCreateDonation = container.resolve(LoadCreateDonationUseCase)

        const {ngo, ngo_donation_counter, workers, date} = await loadCreateDonation.execute({id, user_id})

        return res.status(200).render("views/donations/create-donation", {ngo, ngo_donation_counter, workers, date, username: req.user.name, error: req.error, success: req.success})

    }

}

export {LoadCreateDonationController}
import { Request, Response } from "express"
import { container } from "tsyringe"
import { LoadCreateDonationUseCase } from "./LoadCreateDonationUseCase"



class LoadCreateDonationController {

    async handle(req: Request, res: Response): Promise<any> {

        const { id } = req.params

        
        const loadCreateDonation = container.resolve(LoadCreateDonationUseCase)

        const {ngo, ngo_donation_counter, workers} = await loadCreateDonation.execute({id})

        return res.status(200).render("views/donations/create-donation", {ngo, ngo_donation_counter, workers})

    }

}

export {LoadCreateDonationController}
import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateDonationUseCase } from "./CreateDonationUseCase";
import { AppError } from "../../../../shared/errors/AppError";


class CreateDonationController {

    async handle(req: Request, res: Response): Promise<any> {


        const { donation_value, donor_name, worker_id, is_payed, payed_at } = req.body
        const { id: user_id } = req.user
        const {id: ngo_id} = req.params

        const createDonationUseCase = container.resolve(CreateDonationUseCase)

        const response = await createDonationUseCase.execute({ 
            ngo_id, 
            donor_name,
            user_id, 
            worker_id,
            donation_value, 
            is_payed, 
            payed_at, 
        })

        return res.status(201).render("views/donations/donationReceipt", { response })

    }
}

export { CreateDonationController }
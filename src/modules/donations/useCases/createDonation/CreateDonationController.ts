import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateDonationUseCase } from "./CreateDonationUseCase";
import { AppError } from "../../../../shared/errors/AppError";


class CreateDonationController {

    async handle(req: Request, res: Response): Promise<any> {


        const { donation_value, donor_id, donor_name, worker_id, ngo_id, is_payed, payed_at } = req.body
        const { id } = req.user

        const createDonationUseCase = container.resolve(CreateDonationUseCase)

        const response = await createDonationUseCase.execute({ 
            ngo_id, 
            donor_id, 
            donor_name,
            user_id: id, 
            worker_id,
            donation_value, 
            is_payed, 
            payed_at, 
        })

        return res.status(201).render("donations/donationReceipt", { response })

    }
}

export { CreateDonationController }
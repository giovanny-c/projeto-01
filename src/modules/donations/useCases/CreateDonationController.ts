import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateDonationUseCase } from "./CreateDonationUseCase";


class CreateDonationController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { donation_value } = req.body
        const { donor_id } = req.params
        const { id } = req.user




        const createDonationUseCase = container.resolve(CreateDonationUseCase)

        createDonationUseCase.execute({ donor_id, user_id: id, donation_value })

        return res.status(201).send()

    }
}

export { CreateDonationController }
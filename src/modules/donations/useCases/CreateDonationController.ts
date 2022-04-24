import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateDonationUseCase } from "./CreateDonationUseCase";


class CreateDonationController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { donation_value } = req.body
        const { donor_id } = req.params
        const { user_id } = req.headers


        const createDonationUseCase = container.resolve(CreateDonationUseCase)

        createDonationUseCase.execute({ donor_id, user_id: user_id as string, donation_value })

        return res.status(201).send()

    }
}

export { CreateDonationController }
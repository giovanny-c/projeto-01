import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateDonationUseCase } from "./CreateDonationUseCase";


class CreateDonationController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { donation_value, worker_name } = req.body
        const { donor_id } = req.params
        const { id } = req.user




        const createDonationUseCase = container.resolve(CreateDonationUseCase)

        createDonationUseCase.execute({ donor_id, user_id: id, donation_value }, worker_name)

        return res.status(201).send()

    }
}

export { CreateDonationController }
import { container } from "tsyringe";
import { Request, Response } from "express";
import { CancelDonationUseCase } from "./CancelDonationUseCase";


class CancelDonationController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { id } = req.params
        const { confirmation } = req.body

        const canceledDonationUseCase = container.resolve(CancelDonationUseCase)

        const donation = await canceledDonationUseCase.execute(id, confirmation)

        return res.json(donation)

    }


}

export { CancelDonationController }
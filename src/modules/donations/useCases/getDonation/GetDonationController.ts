import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetDonationUseCase } from "./GetDonationUseCase";


class GetDonationController {


    async handle(req: Request, res: Response): Promise<Response> {

        const { id } = req.params

        const getDonationUseCase = container.resolve(GetDonationUseCase)

        const donation = await getDonationUseCase.execute(id)


        return res.json(donation)
    }
}

export { GetDonationController }
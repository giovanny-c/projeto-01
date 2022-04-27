import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetDonorAndDonationsUseCase } from "./GetDonorAndDonationsUseCase";


class GetDonorAndDonationsController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { id } = req.params

        const getDonorAndDonationsUseCase = container.resolve(GetDonorAndDonationsUseCase)

        const results = await getDonorAndDonationsUseCase.execute(id)


        return res.json(results)
    }
}
export { GetDonorAndDonationsController }
import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetDonorAndDonationsUseCase } from "./GetDonorAndDonationsUseCase";


class GetDonorAndDonationsController {

    async handle(req: Request, res: Response): Promise<any> {

        const { donor_id: id } = req.params

        const getDonorAndDonationsUseCase = container.resolve(GetDonorAndDonationsUseCase)

        const {donor} = await getDonorAndDonationsUseCase.execute(id)


        return res.render("views/donors/donor", {donor, error: req.error, success: req.success} )
    }
}
export { GetDonorAndDonationsController }
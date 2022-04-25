import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateDonationStatusUseCase } from "./UpdateDonationStatusUseCase";


class UpdateDonationStatusController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { id } = req.params

        const updateDonationStatusUseCase = container.resolve(UpdateDonationStatusUseCase)

        const donation = await updateDonationStatusUseCase.execute(id)

        return res.json(donation)
    }



}

export { UpdateDonationStatusController }
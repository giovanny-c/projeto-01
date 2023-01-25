import { container } from "tsyringe";
import { Request, Response } from "express";
import { CancelDonationUseCase } from "./CancelDonationUseCase";


class CancelDonationController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id , donation_number } = req.params
        

        const canceledDonationUseCase = container.resolve(CancelDonationUseCase)

        const {donation, ngo} = await canceledDonationUseCase.execute(ngo_id, +(donation_number))

        return res.redirect(`/instituicao/${ngo.id}/doacao/${donation.donation_number}`)

    }


}

export { CancelDonationController }
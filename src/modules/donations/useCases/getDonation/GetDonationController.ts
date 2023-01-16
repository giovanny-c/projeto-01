import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetDonationUseCase } from "./GetDonationUseCase";


class GetDonationController {


    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id, donation_id } = req.params

        const getDonationUseCase = container.resolve(GetDonationUseCase)

        const {donation, ngo, file, file_name} = await getDonationUseCase.execute({ngo_id, donation_id})


        return res.status(200).render("views/donations/donation", {donation, ngo, file, file_name})
    }
}

export { GetDonationController } 
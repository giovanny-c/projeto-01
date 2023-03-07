import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetDonationUseCase } from "./GetDonationUseCase";


class GetDonationController {


    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id, donation_number } = req.params

        const getDonationUseCase = container.resolve(GetDonationUseCase)

        const {donation, ngo, file, file_name, formated_value, formated_date, messages} = await getDonationUseCase.execute({ngo_id, donation_number: +(donation_number)})

        return res.status(200).render("views/donations/donation", {formated_value, formated_date, donation, ngo, file, file_name, messages, error: req.error, success: req.success })
    }
}

export { GetDonationController } 
import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetLastDonationUseCase } from "./GetLastDonationUseCase";



class GetLastDonationController {


    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params

        const getDonationUseCase = container.resolve(GetLastDonationUseCase)

        const {donation, ngo, file, file_name, formated_value, formated_date} = await getDonationUseCase.execute({ngo_id})

        return res.status(200).render("views/donations/donation", {formated_value, formated_date, donation, ngo, file, file_name, error: req.error})
    }
}

export { GetLastDonationController } 
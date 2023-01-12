import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetDonationUseCase } from "./GetDonationUseCase";


class GetDonationController {


    async handle(req: Request, res: Response): Promise<any> {

        const { id } = req.params

        const getDonationUseCase = container.resolve(GetDonationUseCase)

        const donation = await getDonationUseCase.execute(id)


        return res.status(200).render("views/donations/donation", { donation })
    }
}

export { GetDonationController } 
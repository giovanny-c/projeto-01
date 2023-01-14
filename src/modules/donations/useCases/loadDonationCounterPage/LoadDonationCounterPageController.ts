import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadDonationCounterPageUseCase } from "./loadDonationCounterPageUseCase";




class LoadDonationCounterPageController {

    async handle(req: Request, res: Response): Promise<any> {

        const { id } = req.params
        const { donation_number } = req.body

        const setDonatoionCounter = container.resolve(LoadDonationCounterPageUseCase)

        const response = await setDonatoionCounter.execute({id})

        return res.status(201).render("views/ngos/donation-counter", {response})

    }


}

export { LoadDonationCounterPageController}
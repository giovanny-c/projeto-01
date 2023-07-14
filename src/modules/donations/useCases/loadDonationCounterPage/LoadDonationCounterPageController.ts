import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadDonationCounterPageUseCase } from "./LoadDonationCounterPageUseCase";





class LoadDonationCounterPageController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id: id } = req.params

        

        const setDonatoionCounter = container.resolve(LoadDonationCounterPageUseCase)

        const {ngo, ngo_donation_counter} = await setDonatoionCounter.execute({id})

        return res.status(200).render("views/ngos/donation-counter", {ngos: req.ngos, ngo, ngo_donation_counter, username: req.user.name, error: req.error, success: req.success})

    }


}

export { LoadDonationCounterPageController}
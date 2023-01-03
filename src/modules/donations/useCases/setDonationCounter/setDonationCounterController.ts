import { container } from "tsyringe";
import { Request, Response } from "express";
import { SetDonationCounterUseCase } from "./SetDonationCounterUseCase";




class SetDonationCounterController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { id } = req.params
        const { ngo_id, donation_number } = req.body

        const setDonatoionCounter = container.resolve(SetDonationCounterUseCase)

        const resp = await setDonatoionCounter.execute({ngo_id, new_donation_number: +(donation_number)})

        return res.json(resp)

    }


}

export {SetDonationCounterController }
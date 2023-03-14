import { container } from "tsyringe";
import { Request, Response } from "express";
import { SetDonationCounterUseCase } from "./SetDonationCounterUseCase";




class SetDonationCounterController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id: id } = req.params
        const { donation_number } = req.body
        
        const setDonatoionCounter = container.resolve(SetDonationCounterUseCase)

        const response = await setDonatoionCounter.execute({id, new_donation_number: +(donation_number)})

        return res.status(201).redirect(`/instituicao/${response.ngo.id}/gerenciar`)

    }


}

export {SetDonationCounterController }



import { container } from "tsyringe";
import { Request, Response } from "express";
import { SendReceiptEmailUseCase } from "./SendReceiptEmailUseCase";





class SendReceiptEmailController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params
        const { message_id, donation_id, donors_ids, email } = req.body
        

        const SendReceiptEmail = container.resolve(SendReceiptEmailUseCase)

        const {ngo, donation, success} = await SendReceiptEmail.execute({ngo_id, donation_id, donors_ids, message_id, email: email.toLowerCase() as string})
        
        req.session.success = success

        return res.status(201).redirect(`/instituicao/${ngo.id}/doacao/${donation.donation_number}`)

    }


}

export {SendReceiptEmailController }
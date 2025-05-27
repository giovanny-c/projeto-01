


import { container } from "tsyringe";
import { Request, Response } from "express";
import { SendReceiptUseCase } from "./SendReceiptUseCase";





class SendReceiptController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params
        const { message_id, donation_id, donors_ids, email } = req.body
        const {id: user_id} = req.user

        const SendReceiptEmail = container.resolve(SendReceiptUseCase)

        const {ngo, donation, success} = await SendReceiptEmail.execute({ngo_id, donation_id, donors_ids, message_id, email: email.toLowerCase() as string, user_id})
        
        req.session.success = success

        return res.status(201).redirect(`/instituicao/${ngo.id}/doacao/${donation.donation_number}`)

    }


}

export {SendReceiptController }
import { container } from "tsyringe";
import { Request, Response } from "express";
import { SetEmailMessageUseCase } from "./SetEmailMessageUseCase";





class SetEmailMessageController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params
        const { subject, message, end_day, end_month, start_day, start_month } = req.body
        
        const setEmailMessage = container.resolve(SetEmailMessageUseCase)

        const ngo = await setEmailMessage.execute({ngo_id, end_day, end_month, start_day, start_month, message, subject})
        
        return res.status(201).redirect(`/instituicao/${ngo.id}`)

    }


}

export {SetEmailMessageController }
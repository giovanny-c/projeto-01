import { container } from "tsyringe";
import { Request, Response } from "express";
import { SetEmailMessageUseCase } from "./SetEmailMessageUseCase";





class SetEmailMessageController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params
        const { subject, message, end_date, start_date } = req.body
        
        const setEmailMessage = container.resolve(SetEmailMessageUseCase)

        const ngo = await setEmailMessage.execute({ngo_id, end_date, start_date, message, subject})
        
        return res.status(201).redirect(`/instituicao/${ngo.id}`)

    }


}

export {SetEmailMessageController }
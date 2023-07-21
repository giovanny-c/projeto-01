import { container } from "tsyringe";
import { Request, Response } from "express";
import { SetNgoEmailUseCase } from "./SetNgoEmailUseCase";




class SetNgoEmailController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params
        const {id: user_id} = req.user
        const { email, password, user_password} = req.body
        
        const setNgoEmail = container.resolve(SetNgoEmailUseCase)

        const {ngo, success} = await setNgoEmail.execute({ngo_id, email: email.toLowerCase() as string, password, user_id, user_password})
        
        req.session.success = success



        return res.status(201).redirect(`/instituicao/${ngo.id}/gerenciar`)

    }


}

export {SetNgoEmailController }
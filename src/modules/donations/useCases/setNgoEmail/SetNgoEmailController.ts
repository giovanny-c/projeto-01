import { container } from "tsyringe";
import { Request, Response } from "express";
import { SetNgoEmailUseCase } from "./SetNgoEmailUseCase";




class SetNgoEmailController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params
        const { email, password } = req.body
        
        const setNgoEmail = container.resolve(SetNgoEmailUseCase)

        const {ngo} = await setNgoEmail.execute({ngo_id, email, password})
        
        return res.status(201).redirect(`/instituicao/${ngo.id}`)

    }


}

export {SetNgoEmailController }
import { container } from "tsyringe";
import { Request, Response } from "express";

import { CreateDonorUseCase } from "./CreateDonorUseCase";


class CreateDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const { name, email, phone, worker_id } = req.body
        const {id: user_id, admin} = req.user

         //tira os ()

        const createDonorUseCase = container.resolve(CreateDonorUseCase)

        const {donor}  = await createDonorUseCase.execute({ name, email, phone, user_id, worker_id })

        if(!admin){
            req.session.success="Doador Criado com sucesso"
            return res.status(201).redirect(`/doadores/`)
        }

        return res.redirect(`/doadores/${donor.id}`)
    }


}

export { CreateDonorController }
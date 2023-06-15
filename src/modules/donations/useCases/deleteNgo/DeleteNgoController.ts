import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteNgoUseCase } from "./DeleteNgoUseCase";


class DeleteNgoController {

    async handle(req: Request, res: Response){

        const {password, delete_name} = req.body
        const {ngo_id} = req.params
        const {id: user_id} = req.user

        const deleteNgo = container.resolve(DeleteNgoUseCase)

        await deleteNgo.execute({ngo_id, user_id, password, delete_name})

        return res.redirect(`/gerenciar-instituicoes`)
    }

}

export{ DeleteNgoController}
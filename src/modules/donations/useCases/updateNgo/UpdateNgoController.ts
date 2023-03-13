import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateNgoUseCase } from "./UpdateNgoUseCase";


class UpdateNgoController {

    async handle(req: Request, res: Response){

        const {name, full_name} = req.body
        const {ngo_id: id} = req.params

        const updateNgo = container.resolve(UpdateNgoUseCase)

        const {ngo} = await updateNgo.execute({full_name, id, name})

        return res.redirect(`/instituicao/${ngo.id}/gerenciar`)
    }

}

export{ UpdateNgoController}
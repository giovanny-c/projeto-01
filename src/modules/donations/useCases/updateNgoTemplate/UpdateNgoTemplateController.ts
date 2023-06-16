import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateNgoTemplateUseCase } from "./UpdateNgoTemplateUseCase";



class UpdateNgoTemplateController {

    async handle(req: Request, res: Response){


        const {file} = req
        const {ngo_id} = req.params
        const {id: admin_id} = req.user

        const updateTemplate = container.resolve(UpdateNgoTemplateUseCase)

        await updateTemplate.execute({file, ngo_id, admin_id})

        req.session.success = "Template atualizado com sucesso!"

        return res.redirect(`/instituicao/${ngo_id}/gerenciar`)

    }

}

export {UpdateNgoTemplateController}
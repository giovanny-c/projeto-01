


import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateNgoTemplateConfigUseCase } from "./UpdateNgoTemplateConfigUseCase";



class UpdateNgoTemplateConfigController {

    async handle(req: Request, res: Response){


        const {file} = req
        const {ngo_id} = req.params
        const {id: admin_id} = req.user


        const updateTemplateConfig = container.resolve(UpdateNgoTemplateConfigUseCase)

        await updateTemplateConfig.execute({file, ngo_id, admin_id})

        req.session.success = "Configuração do template atualizada com sucesso!"

        return res.redirect(`/instituicao/${ngo_id}/gerenciar`)

    }

}

export {UpdateNgoTemplateConfigController}



import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateNgoTemplateConfigUseCase } from "./UpdateNgoTemplateConfigUseCase";



class UpdateNgoTemplateConfigController {

    async handle(req: Request, res: Response){


        const {file} = req
        const {ngo_id} = req.params

        const updateTemplateConfig = container.resolve(UpdateNgoTemplateConfigUseCase)

        await updateTemplateConfig.execute({file, ngo_id})

        req.session.success = "Configuração do template atualizada com sucesso!"

        return res.redirect(`/instituicao/${ngo_id}/gerenciar`)

    }

}

export {UpdateNgoTemplateConfigController}
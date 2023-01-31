import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ImportDonationsUseCase } from "./ImportDonationsUseCase";



class ImportDonationsController {

    async handle(req: Request, res: Response): Promise<any> {

        const { file } = req
        const { id: user_id} = req.user
        const {ngo_id} = req.params

        const importDonationsUseCase = container.resolve(ImportDonationsUseCase)

        let {ngo} = await importDonationsUseCase.execute({file, user_id, ngo_id})

        return res.status(201).redirect(`/instituicao/${ngo.id}/doacao/listar`)
    }
}

export { ImportDonationsController }
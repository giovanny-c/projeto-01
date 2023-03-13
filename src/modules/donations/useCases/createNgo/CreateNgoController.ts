import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateNgoUseCase } from "./CreateNgoUseCase";


class CreateNgoController {

    async handle(req: Request, res: Response): Promise<any> {

        const { id } = req.params
        const { name, full_name, alias } = req.body

        const createNgo = container.resolve(CreateNgoUseCase)

        await createNgo.execute({name, full_name, alias})

        return res.redirect(`/gerenciar-instituicoes`)

    }


}

export { CreateNgoController }
import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateDonorUseCase } from "./UpdateDonorUseCase";


class UpdateDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const { donor_id: id } = req.params

        const { name, email, phone } = req.body

        const updateDonorUseCase = container.resolve(UpdateDonorUseCase)

        const result = await updateDonorUseCase.execute({ id, name, email, phone })

        return res.redirect("/doadores/listar")
    }


}

export { UpdateDonorController }
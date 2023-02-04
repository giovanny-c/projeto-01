import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteDonorUseCase } from "./DeleteDonorUseCase";



class DeleteDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const { donor_id: id } = req.params

        const deleteDonorUseCase = container.resolve(DeleteDonorUseCase)

        await deleteDonorUseCase.execute({id})

        return res.redirect("/doadores/listar")
    }


}

export { DeleteDonorController }
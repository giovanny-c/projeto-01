import { Request, Response } from "express";
import { container } from "tsyringe";
import { LoadUpdateDonorUseCase } from "./LoadUpdateDonorUseCase";


class LoadUpdateDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const { donor_id: id } = req.params

        const loadUpdateDonorUseCase = container.resolve(LoadUpdateDonorUseCase)

        const donor = await loadUpdateDonorUseCase.execute({id})


        return res.render("views/donors/create-donor", {donor, error: req.error, success: req.success} )
    }
}
export { LoadUpdateDonorController }
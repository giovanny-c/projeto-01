import { Request, Response } from "express";
import { container } from "tsyringe";
import { LoadUpdateDonorUseCase } from "./LoadUpdateDonorUseCase";


class LoadUpdateDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const { donor_id } = req.params
        const {id: user_id} = req.user


        const loadUpdateDonorUseCase = container.resolve(LoadUpdateDonorUseCase)

        const {donor, workers} = await loadUpdateDonorUseCase.execute({donor_id, user_id})


        return res.render("views/donors/create-donor", {donor, workers, username: req.user.name, error: req.error, success: req.success} )
    }
}
export { LoadUpdateDonorController }
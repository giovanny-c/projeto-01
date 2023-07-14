import { Request, Response } from "express";
import { LoadCreateDonorUseCase } from "./LoadCreateDonorUseCase";
import { container } from "tsyringe";


class LoadCreateDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const {admin, id } = req.user

        const loadCreateDonor = container.resolve(LoadCreateDonorUseCase)

        //passa o id se for admin
        const workers = await loadCreateDonor.execute(admin? id : null)

        return res.render("views/donors/create-donor", {ngos: req.ngos, workers, username: req.user.name, error: req.error, success: req.success})
    }


}

export { LoadCreateDonorController }
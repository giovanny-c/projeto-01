import { Request, Response } from "express";

import { container } from "tsyringe"

import { LoadUserUpdateUseCase } from "./LoadUserUpdateUseCase";

class LoadUserUpdateController {


    async handle(req: Request, res: Response): Promise<any> {

        const {user_id: id} = req.params
        const {id: admin_id} = req.user
        
        const loadUserUpdateUseCase = container.resolve(LoadUserUpdateUseCase)

        const {user, workers} = await loadUserUpdateUseCase.execute({id})

        return res.status(200).render("views/users/create-user", {user, workers, admin_id, username: req.user.name, error: req.error, success: req.success})
    }

}

export { LoadUserUpdateController }
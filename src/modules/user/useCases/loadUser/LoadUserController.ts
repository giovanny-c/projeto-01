import { Request, Response } from "express";

import { container } from "tsyringe"
import { LoadUserUseCase } from "./LoadUserUseCase";

class LoadUserController {


    async handle(req: Request, res: Response): Promise<any> {

        const {user_id} = req.params
        const {user: admin_user} = req

        const loadUsersUseCase = container.resolve(LoadUserUseCase)

        const user = await loadUsersUseCase.execute(user_id)

        return res.status(200).render("views/users/user", {user, admin_user, error: req.error, success: req.success})
    }

}

export { LoadUserController }
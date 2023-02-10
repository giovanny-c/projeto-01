import { Request, Response } from "express";

import { container } from "tsyringe"
import { LoadUserUseCase } from "./LoadUserUseCase";

class LoadUserController {


    async handle(req: Request, res: Response): Promise<any> {

        const {user_id} = req.params

        const loadUsersUseCase = container.resolve(LoadUserUseCase)

        const user = await loadUsersUseCase.execute(user_id)

        return res.status(200).render("views/users/user", {user, error: req.error})
    }

}

export { LoadUserController }
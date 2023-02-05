import { Request, Response } from "express";

import { container } from "tsyringe"
import { LoadUsersUseCase } from "./LoadUsersUseCase";

class LoadUsersController {


    async handle(req: Request, res: Response): Promise<any> {

        const loadUsersUseCase = container.resolve(LoadUsersUseCase)

        const users = await loadUsersUseCase.execute()

        return res.status(200).render("views/users/users", {users})
    }

}

export { LoadUsersController }
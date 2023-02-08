import { Request, Response } from "express";

import { container } from "tsyringe"
import { LoadUsersUseCase } from "./LoadUsersUseCase";

class LoadUsersController {


    async handle(req: Request, res: Response): Promise<any> {

        let error
        if(req.session.error){
            error = req.session.error
            req.session.error = ""
            console.log(req.session)
        }

        const loadUsersUseCase = container.resolve(LoadUsersUseCase)

        const users = await loadUsersUseCase.execute()

        return res.status(200).render("views/users/users", {users, error})
    }

}

export { LoadUsersController }
import { Request, Response } from "express";
import { container } from "tsyringe";
import { LoadCreateUserUseCase } from "./LoadCreateUserUseCase";


class LoadCreateUserController {


    async handle(req: Request, res: Response): Promise<any> {

        const loadCreateUser = container.resolve(LoadCreateUserUseCase)

        const workers = await loadCreateUser.execute()
        
        return res.status(200).render("views/users/create-user", {workers, username: req.user.name, error: req.error, success: req.success})
    }

}

export { LoadCreateUserController }
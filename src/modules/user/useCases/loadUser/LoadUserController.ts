import { Request, Response } from "express";

import { container } from "tsyringe"
import { LoadUserUseCase } from "./LoadUserUseCase";

class LoadUserController {


    async handle(req: Request, res: Response): Promise<any> {

        const {user_id} = req.params
        const {id: admin_id, admin} = req.user

        const loadUsersUseCase = container.resolve(LoadUserUseCase)

        const {user, admin_user} = await loadUsersUseCase.execute({
            user_id, 
            admin_user_id: admin? admin_id : null
        
        })

        

        return res.status(200).render("views/users/user", {ngos: req.ngos, user, admin_user, username: req.user.name, error: req.error, success: req.success})
    }

}

export { LoadUserController }
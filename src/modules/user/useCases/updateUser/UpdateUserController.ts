import { Request, Response } from "express";

import { container } from "tsyringe"
import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {


    async handle(req: Request, res: Response): Promise<any> {

        const {id: admin_id} = req.user
        const {user_id: id} = req.params
        const { user_name: name, password, email, is_admin } = req.body

        const updateUserUseCase = container.resolve(UpdateUserUseCase)

        const user = await updateUserUseCase.execute({id, name, password, email, is_admin, admin_id })

        return res.status(201).redirect(`/usuarios/${user.id}`)
    }

}

export { UpdateUserController }
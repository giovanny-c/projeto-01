import { Request, Response } from "express";

import { container } from "tsyringe"
import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {


    async handle(req: Request, res: Response): Promise<any> {

        const {id} = req.params
        const { user_name: name, password, email, admin } = req.body

        const updateUserUseCase = container.resolve(UpdateUserUseCase)

        const user = await updateUserUseCase.execute({id, name, password, email, admin })

        return res.status(201).redirect(`/usuarios/${user.id}`)
    }

}

export { UpdateUserController }
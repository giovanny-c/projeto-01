import { Request, Response } from "express";

import { container } from "tsyringe"
import { DeleteUserUseCase } from "./DeleteUserUseCase";


class DeleteUserController {


    async handle(req: Request, res: Response): Promise<any> {

        const {id: admin_id, admin} = req.user
        const {user_id} = req.params
        
        const deleteUserUseCase = container.resolve(DeleteUserUseCase)

        await deleteUserUseCase.execute({
            user_id,
            admin_id: admin? admin_id : "" // se admin for true passa o adminId
        })

        return res.status(201).redirect(`/usuarios`)
    }

}

export { DeleteUserController }
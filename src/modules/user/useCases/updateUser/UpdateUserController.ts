import { Request, Response } from "express";

import { container } from "tsyringe"
import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {


    async handle(req: Request, res: Response): Promise<any> {

        const {id: admin_id, admin} = req.user
        const {user_id: id} = req.params
        const { user_name: name, password, email, is_admin, worker_id } = req.body

        const updateUserUseCase = container.resolve(UpdateUserUseCase)

        const user = await updateUserUseCase.execute({
            id, 
            name, 
            password, 
            email: email.toLowerCase() as string, 
            is_admin, 
            admin_id: admin? admin_id : "", // se admin for true passa o adminId
            worker_id
        })

        //se tirar o admin do proprio user
        //destroi a sessao e redireciona
        if(user.admin === false && user.id === admin_id){
            req.session.destroy()

            return res.redirect("/entrar")
        }

        return res.status(201).redirect(`/usuarios/${user.id}`)
    }

}

export { UpdateUserController }
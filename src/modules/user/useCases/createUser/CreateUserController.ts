import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { container } from "tsyringe"

class CreateUserController {


    async handle(req: Request, res: Response): Promise<any> {


        const { user_name: name, password, confirm_password, email, is_admin, worker_id } = req.body

        console.log(worker_id)

        const createUserUseCase = container.resolve(CreateUserUseCase)

        await createUserUseCase.execute({ name, password, confirm_password, email, is_admin })

        return res.status(201).redirect(`/usuarios`)
    }

}

export { CreateUserController }
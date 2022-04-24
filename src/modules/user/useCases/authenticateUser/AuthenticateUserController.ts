import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


class AuthenticateUserController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { name, password } = req.body

        const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)

        const token = await authenticateUserUseCase.execute({ name, password })

        return res.json(token)
    }


}

export { AuthenticateUserController }
import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


class AuthenticateUserController {

    async handle(req: Request, res: Response): Promise<any> {

        const { name, password } = req.body

        const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)

        const response = await authenticateUserUseCase.execute({ name, password })

        req.session.user = response.user
        req.session.created_at = response.created_at

        return res.redirect("/doacao/instituicao/listagem")
    }


}

export { AuthenticateUserController }
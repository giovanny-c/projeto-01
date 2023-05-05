import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


class AuthenticateUserController {

    async handle(req: Request, res: Response): Promise<any> {

        const { name, password } = req.body

        const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)

        const response = await authenticateUserUseCase.execute({ nameOrEmail: name, password })

        req.session.user = response.user
        req.session.created_at = response.created_at

        if(!response.user.admin){//se o user nao for admin 
            req.session.cookie.originalMaxAge = 1000 * 60 * 60
            // o tempo do cookie e de 1h
        }

        
        return res.redirect("/")
    }


}

export { AuthenticateUserController }
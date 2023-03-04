import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";


class ResetPasswordController {

    async handle(req: Request, res: Response){

        const {token} = req.query
        const { email, password, password_confirmation } = req.body

        const resetPasswordUseCase = container.resolve(ResetPasswordUseCase)

        await resetPasswordUseCase.execute({email, password , password_confirmation, token: token as string})

        // return res.status(200).render(/*"view de reset pass, success: Senha alterada com sucesso!"*/)
    }
}

export { ResetPasswordController }
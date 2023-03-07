import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";


class ResetPasswordController {

    async handle(req: Request, res: Response){

        
        
        const { email, password, password_confirmation, token } = req.body

        const resetPasswordUseCase = container.resolve(ResetPasswordUseCase)

        const {success} = await resetPasswordUseCase.execute({email, password , password_confirmation, token: token as string})
        req.session.success = success
        
        return res.status(200).redirect("/entrar")
    }
}

export { ResetPasswordController }
import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendForgotPasswordUseCase } from "./SendForgotPasswordUseCase";


class SendForgotPasswordController {

    async handle(req: Request, res: Response){

        const { email } = req.body

        const sendForgotPasswordUseCase = container.resolve(SendForgotPasswordUseCase)

        await sendForgotPasswordUseCase.execute(email)

        return res.status(200).redirect("/entrar")
    }
}

export { SendForgotPasswordController }
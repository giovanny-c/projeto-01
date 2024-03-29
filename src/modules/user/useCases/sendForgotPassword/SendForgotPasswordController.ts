import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendForgotPasswordUseCase } from "./SendForgotPasswordUseCase";


class SendForgotPasswordController {

    async handle(req: Request, res: Response){

        const { email } = req.body

        const sendForgotPasswordUseCase = container.resolve(SendForgotPasswordUseCase)

        const {success} =  await sendForgotPasswordUseCase.execute(email.toLowerCase() as string)

        return res.status(200).render("views/session/forgot", {success} )
    }
}

export { SendForgotPasswordController }
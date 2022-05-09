import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendForgotPasswordUseCase } from "./SendForgotPasswordUseCase";


class SendForgotPasswordController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { user_name, email } = req.body

        const sendForgotPasswordUseCase = container.resolve(SendForgotPasswordUseCase)

        await sendForgotPasswordUseCase.execute(user_name, email)

        return res.status(200).send()
    }
}

export { SendForgotPasswordController }
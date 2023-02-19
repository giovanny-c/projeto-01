import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendForgotPasswordUseCase } from "./SendForgotPasswordUseCase";


class SendForgotPasswordController {

    async handle(req: Request, res: Response): Promise<Response> {

        // const { user_name, email } = req.body

        const sendForgotPasswordUseCase = container.resolve(SendForgotPasswordUseCase)

        await sendForgotPasswordUseCase.execute()

        return res.status(200).send("ok")
    }
}

export { SendForgotPasswordController }
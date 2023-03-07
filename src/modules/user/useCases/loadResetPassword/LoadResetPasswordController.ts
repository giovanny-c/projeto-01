
import { Request, Response } from "express";


class LoadResetPasswordController {


    async handle(req: Request, res: Response): Promise<any> {

        const {token} = req.query

        return res.status(200).render("views/session/reset-password", {token: token as string, error: req.error, success: req.success})
    }

}

export { LoadResetPasswordController }
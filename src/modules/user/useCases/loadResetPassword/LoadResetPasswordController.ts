

import { Request, Response } from "express";



class LoadResetPasswordController {


    async handle(req: Request, res: Response): Promise<any> {



        return res.status(200).render("views/session/reset-password", {error: req.error})
    }

}

export { LoadResetPasswordController }
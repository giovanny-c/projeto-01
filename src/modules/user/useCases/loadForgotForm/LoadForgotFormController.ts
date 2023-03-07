
import { Request, Response } from "express";


class LoadForgotFormController {


    async handle(req: Request, res: Response) {


        return res.status(200).render("views/session/forgot", {error: req.error, success: req.success})
    
    }



}

export { LoadForgotFormController }
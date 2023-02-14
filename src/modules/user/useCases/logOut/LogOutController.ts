import { Request, Response } from "express";


class LogOutController {


    async handle(req: Request, res: Response) {


        req.session.destroy()

        return res.status(200).redirect("/entrar")
        // return res.redirect("/accounts/login")
    }



}

export { LogOutController }
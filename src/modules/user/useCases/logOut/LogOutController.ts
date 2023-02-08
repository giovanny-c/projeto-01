import { Request, Response } from "express";
import { container } from "tsyringe";
import { LogOutUseCase } from "./LogOutUseCase";


class LogOutController {


    async handle(req: Request, res: Response) {

        const { id } = req.user // || req.body || req.query

        const logOut = container.resolve(LogOutUseCase)

        await logOut.execute(id)

        req.session.destroy()

        return res.status(200).redirect("/entrar")
        // return res.redirect("/accounts/login")
    }



}

export { LogOutController }
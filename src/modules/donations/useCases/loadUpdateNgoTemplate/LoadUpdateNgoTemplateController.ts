import { Request, Response } from "express";


class LoadUpdateNgoTemplateController {

    async handle(req: Request, res: Response){

        return res.status(200).render("views/ngos/ngo-template-update", {username: req.user.name, error: req.error, success: req.success})

    }

}

export {LoadUpdateNgoTemplateController}
import { Request, Response } from "express";



class LoadLoginPageController {
 


    async handle(req: Request, res: Response): Promise<any>{


        return res.render("views/session/login")
    }
}

export {LoadLoginPageController}
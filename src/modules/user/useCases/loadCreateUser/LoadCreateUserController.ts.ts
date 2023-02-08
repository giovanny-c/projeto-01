import { Request, Response } from "express";


class LoadCreateUserController {


    async handle(req: Request, res: Response): Promise<any> {

        
        return res.status(200).render("views/users/create-user")
    }

}

export { LoadCreateUserController }
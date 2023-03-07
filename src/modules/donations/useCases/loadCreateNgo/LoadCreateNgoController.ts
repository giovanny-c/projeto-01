
import { Request, Response } from "express"



class LoadCreateNgoController {

    async handle(req: Request, res: Response): Promise<any> {



        return res.status(200).render("views/ngos/create-ngo", {error: req.error, success: req.success})

    }

}

export {LoadCreateNgoController}
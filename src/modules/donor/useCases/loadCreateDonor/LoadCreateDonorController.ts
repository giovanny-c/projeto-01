import { Request, Response } from "express";


class LoadCreateDonorController {

    async handle(req: Request, res: Response): Promise<any> {


        return res.render("views/donors/create-donor", {error: req.error})
    }


}

export { LoadCreateDonorController }
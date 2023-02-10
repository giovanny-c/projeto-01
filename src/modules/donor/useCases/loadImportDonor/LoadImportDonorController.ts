import { Request, Response } from "express";


class LoadImportDonorController {

    async handle(req: Request, res: Response): Promise<any> {


        return res.render("views/donors/import-donors", {error: req.error})
    }


}

export { LoadImportDonorController }
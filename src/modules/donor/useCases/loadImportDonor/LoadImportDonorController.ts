import { Request, Response } from "express";


class LoadImportDonorController {

    async handle(req: Request, res: Response): Promise<any> {


        return res.render("views/donors/import-donors")
    }


}

export { LoadImportDonorController }
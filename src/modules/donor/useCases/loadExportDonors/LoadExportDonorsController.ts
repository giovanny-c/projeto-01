import { Request, Response } from "express";


class LoadExportDonorController {

    async handle(req: Request, res: Response): Promise<any> {


        return res.render("views/donors/export-donors", {username: req.user.name, error: req.error, success: req.success})
    }


}

export { LoadExportDonorController }
import { Request, Response } from "express";


class LoadDonorsHubController {

    async handle(req: Request, res: Response): Promise<any> {


        return res.render("views/donors/donors",{error: req.error, success: req.success})
    }


}

export { LoadDonorsHubController }
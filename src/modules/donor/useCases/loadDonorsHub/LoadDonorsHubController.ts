import { Request, Response } from "express";


class LoadDonorsHubController {

    async handle(req: Request, res: Response): Promise<any> {


        return res.render("views/donors/donors",{ngos: req.ngos, username: req.user.name, error: req.error, success: req.success})
    }


}

export { LoadDonorsHubController }
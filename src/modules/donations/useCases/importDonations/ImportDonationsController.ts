import { Request, Response } from "express";
import { AppError } from "../../../../shared/errors/AppError";

class ImportDonationsController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { file } = req

        if (!file) {
            throw new AppError("erro")
        }
        if (file) {
            console.log("success")
        }


        return res.send()
    }
}

export { ImportDonationsController }
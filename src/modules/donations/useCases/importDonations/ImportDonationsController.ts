import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ImportDonationsUseCase } from "./ImportDonationsUseCase";

class ImportDonationsController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { file } = req
        const { user } = req

        const importDonationsUseCase = container.resolve(ImportDonationsUseCase)

        await importDonationsUseCase.execute(file, user.id)

        return res.status(201).send()
    }
}

export { ImportDonationsController }
import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ImportDonationsUseCase } from "./ImportDonationsUseCase";

class ImportDonationsController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { file } = req
        const { user } = req

        const importDonationsUseCase = container.resolve(ImportDonationsUseCase)

        const response = await importDonationsUseCase.execute(file, user.id)

        if (response) {
            throw new AppError(response, 400)
        }

        return res.status(201).send()
    }
}

export { ImportDonationsController }
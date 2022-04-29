import { Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ImportDonationsUseCase } from "./ImportDonationsUseCase";

class ImportDonationsController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { file } = req

        const importDonationsUseCase = container.resolve(ImportDonationsUseCase)

        await importDonationsUseCase.execute(file)

        return res.send()
    }
}

export { ImportDonationsController }
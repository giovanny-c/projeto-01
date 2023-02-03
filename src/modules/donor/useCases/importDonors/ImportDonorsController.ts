import { Request, Response } from "express";
import { container } from "tsyringe";
import { ImportDonorsUseCase } from "./ImportDonorsUseCase";



class ImportDonorsController {

    async handle(req: Request, res: Response): Promise<any> {

        const {file} = req

        const importDonorsUseCase = container.resolve(ImportDonorsUseCase)

        await importDonorsUseCase.execute(file)
        

        return res.redirect("/doadores/listar")
    }


}

export { ImportDonorsController }
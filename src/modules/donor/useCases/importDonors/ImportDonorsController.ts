import { Request, Response } from "express";
import { container } from "tsyringe";
import { ImportDonorsUseCase } from "./ImportDonorsUseCase";



class ImportDonorsController {

    async handle(req: Request, res: Response): Promise<any> {

        const {file} = req
        const {id: user_id} = req.user

        const importDonorsUseCase = container.resolve(ImportDonorsUseCase)

        await importDonorsUseCase.execute(file, user_id)
        

        return res.redirect("/doadores/listar")
    }


}

export { ImportDonorsController }
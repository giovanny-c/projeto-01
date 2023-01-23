import { Request, Response } from "express";
import { container } from "tsyringe";
import { LoadBookletUseCase } from "./LoadBookletUseCase";



class LoadBookletController{


    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id, year, month, file_name } = req.params

        const loadBookletUseCase = container.resolve(LoadBookletUseCase)

        const {file, ngo} = await loadBookletUseCase.execute({ngo_id, year, month, file_name})

        return res.status(200).render("views/donations/booklet", {file, ngo})
    }
}

export { LoadBookletController} 
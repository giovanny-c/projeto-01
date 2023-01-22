import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadGenerateBookletUseCase } from "./LoadGenerateBookletUseCase";





class LoadGenerateBookletController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params

        const loadGenerateBooklet = container.resolve(LoadGenerateBookletUseCase)

        const {ngo, donation_counter} = await loadGenerateBooklet.execute({ngo_id})
            
        return res.status(200).render("views/donations/generate-booklet", {ngo, donation_counter})

    }


}

export { LoadGenerateBookletController}
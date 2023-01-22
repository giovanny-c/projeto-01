import { Request, Response } from "express";
import { container } from "tsyringe";
import { GenerateBookletUseCase } from "./GenerateBookletUseCase";


class GenerateBookletController {

    async handle(req: Request, res: Response): Promise<Response>{

        const {first_number, last_number} = req.body
        const {ngo_id} = req.params

        const generateBooklet = container.resolve(GenerateBookletUseCase)

        await generateBooklet.execute({first_number: +(first_number), last_number: +(last_number), ngo_id})

        return res.status(200).send()
    }   


}

export{GenerateBookletController}
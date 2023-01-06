import { Request, Response } from "express";
import { container } from "tsyringe";
import { GenerateBeadUseCase } from "./GenerateBeadUseCase";


class GenerateBeadController {

    async handle(req: Request, res: Response): Promise<Response>{

        const {first_number, last_number, ngo_id} = req.body

        const generateBead = container.resolve(GenerateBeadUseCase)

        await generateBead.execute({first_number,last_number,ngo_id})

        return res.status(200)
    }   


}

export{GenerateBeadController}
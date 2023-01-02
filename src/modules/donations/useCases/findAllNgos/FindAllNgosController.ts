import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindAllNgosUseCase } from "./FindAllNgosUseCase";


class FindAllNgosController {
 
    async handle(req: Request, res: Response): Promise<Response>{        

        const findAllNgos = container.resolve(FindAllNgosUseCase)

        const ngos =  await findAllNgos.execute()

        return res.status(200).json(ngos)

    }


}

export {FindAllNgosController}
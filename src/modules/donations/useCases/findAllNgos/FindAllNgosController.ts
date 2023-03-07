import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindAllNgosUseCase } from "./FindAllNgosUseCase";


class FindAllNgosController {
 
    async handle(req: Request, res: Response): Promise<any>{        

        const findAllNgos = container.resolve(FindAllNgosUseCase)

        const ngos =  await findAllNgos.execute()

        return res.status(200).render("views/ngos/ngos", {ngos, error: req.error, success: req.success})
    }


}

export {FindAllNgosController}
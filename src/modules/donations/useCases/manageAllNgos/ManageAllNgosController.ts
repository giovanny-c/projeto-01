import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindAllNgosUseCase } from "../findAllNgos/FindAllNgosUseCase";



class ManageAllNgosController {
 
    async handle(req: Request, res: Response): Promise<any>{        


        const manageAllNgos = container.resolve(FindAllNgosUseCase)

        const ngos =  await manageAllNgos.execute()

        return res.status(200).render("views/ngos/manage-ngos", {ngos, error: req.error, success: req.success})
    }


}

export {ManageAllNgosController}
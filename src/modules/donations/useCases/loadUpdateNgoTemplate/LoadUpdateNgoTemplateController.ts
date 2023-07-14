import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetNgoUseCase } from "../getNgo/GetNgoUseCase";


class LoadUpdateNgoTemplateController {

    async handle(req: Request, res: Response){

        const {ngo_id: id} = req.params

        
        const getNgo = container.resolve(GetNgoUseCase)

        const {ngo} = await getNgo.execute(id)

        return res.status(200).render("views/ngos/ngo-template-update", {ngos: req.ngos, ngo, username: req.user.name, error: req.error, success: req.success})

    }

}

export {LoadUpdateNgoTemplateController}
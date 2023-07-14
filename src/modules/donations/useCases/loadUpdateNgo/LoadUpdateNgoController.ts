import { Request, Response } from "express";
import { container} from "tsyringe";
import { GetNgoUseCase } from "../getNgo/GetNgoUseCase";



class LoadUpdateNgoController {

        

    async handle(req: Request, res: Response): Promise<any>{

        const {ngo_id: id} = req.params

        
        const getNgo = container.resolve(GetNgoUseCase)

        const {ngo, ngo_donation_counter} = await getNgo.execute(id)

        
        return res.status(200).render("views/ngos/update-ngo", {ngos: req.ngos, ngo, ngo_donation_counter, username: req.user.name, error: req.error, success: req.success})
    }

}

export {LoadUpdateNgoController}
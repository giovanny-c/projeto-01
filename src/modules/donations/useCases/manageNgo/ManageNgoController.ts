import { Request, Response } from "express";
import { container} from "tsyringe";
import { GetNgoUseCase } from "../getNgo/GetNgoUseCase";


class ManageNgoController {

        

    async handle(req: Request, res: Response): Promise<any>{

        const {ngo_id: id} = req.params

        
        const manageNgo = container.resolve(GetNgoUseCase)

        const {ngo, ngo_donation_counter} = await manageNgo.execute(id)

        
        return res.status(200).render("views/ngos/manage-ngo", {ngo, ngo_donation_counter, error: req.error, success: req.success})
    }

}

export {ManageNgoController}
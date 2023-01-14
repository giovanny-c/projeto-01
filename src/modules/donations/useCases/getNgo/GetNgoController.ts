import { Request, Response } from "express";
import { container} from "tsyringe";
import { GetNgoUseCase } from "./GetNgoUseCase";


class GetNgoController {

        

    async handle(req: Request, res: Response): Promise<any>{

        const {id} = req.params

        
        const getNgo = container.resolve(GetNgoUseCase)

        const {ngo, ngo_donation_counter} = await getNgo.execute(id)

        
       

        return res.status(200).render("views/ngos/ngo", {ngo, ngo_donation_counter})
    }

}

export {GetNgoController}
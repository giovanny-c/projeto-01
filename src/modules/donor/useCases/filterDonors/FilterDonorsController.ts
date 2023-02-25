import { Request, Response } from "express";
import { container } from "tsyringe";
import { FilterDonorsUseCase } from "./FilterDonorsUseCase";




class FilterDonorsController {

    async handle(req: Request, res: Response){

        const {value} = req.query
        

        const filterDonors = container.resolve(FilterDonorsUseCase)

        const donors = await filterDonors.execute(value as string)

        return res.status(200).json(donors)




    }

}


export{FilterDonorsController}
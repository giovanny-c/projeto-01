

import { container } from "tsyringe";
import { Request, Response } from "express";
import { GetBalanceUseCase } from "./GetBalanceUseCase";





class GetBalanceController {

    async handle(req: Request, res: Response): Promise<any> {

        const { 
            ordenar: orderBy, 
            limit, 
            pagina: page, 
            data_de_inicio: startDate, 
            data_de_termino: endDate, 
            funcionario: worker_id, 
        } = req.query


        const {ngo_id} = req.params
        

        const getBalance = container.resolve(GetBalanceUseCase)

        const { donations, ngo, search_terms, workers, sum} = await getBalance.execute({
            orderBy: orderBy as string,
            limit: +(limit),
            page: +(page),
            startDate: startDate as string ,
            endDate: endDate as string,
            ngo_id: ngo_id as string,
            worker_id: worker_id as string
            
        })
        
        return res.status(200).render("views/donations/balance", {donations, ngo, search_terms, workers, sum, username: req.user.name, error: req.error, success: req.success})
    }
}

export { GetBalanceController }
import { container } from "tsyringe";
import { Request, Response } from "express";
import { ListDonationsUseCase } from "./ListDonationsUseCase";




class ListDonationsController {

    async handle(req: Request, res: Response): Promise<any> {

        const { 
            ordenar: orderBy, 
            limit, 
            pagina: page, 
            data_de_inicio: startDate, 
            data_de_termino: endDate, 
            funcionario: worker_id, 
            doador: donor_name,
            numero_da_doacao: donation_number,
            not_email: not_email
        } = req.query

        


        const {ngo_id} = req.params
        
        const {user} = req

        const listDonationsUseCase = container.resolve(ListDonationsUseCase)

        const {donations, ngo, workers, search_terms} = await listDonationsUseCase.execute({
            orderBy: orderBy as string,
            limit: +(limit),
            page: +(page),
            donation_number: +(donation_number),
            startDate: startDate as string,
            endDate: endDate as string,
            donor_name: donor_name as string,
            ngo_id: ngo_id as string,
            worker_id: worker_id as string,
            not_email: not_email as string,
            user
        })

        

        return res.status(200).render("views/donations/search-donations", {
            donations, 
            workers, 
            search_terms, 
            user, 
            ngo, 
            ngos: req.ngos,
            username: req.user.name,
            error: req.error, 
            success: req.success})
    }
}

export { ListDonationsController }
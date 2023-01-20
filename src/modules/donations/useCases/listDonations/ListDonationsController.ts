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
            funcionario: worker_name, 
            doador: donor_name,
            numero_da_doacao: donation_number
        } = req.query


        const {ngo_id} = req.params
        

        const listDonationsUseCase = container.resolve(ListDonationsUseCase)

        const {sum, donations, ngo, search_terms} = await listDonationsUseCase.execute({
            orderBy: orderBy as string,
            limit: +(limit),
            page: +(page),
            donation_number: +(donation_number),
            startDate: startDate as string,
            endDate: endDate as string,
            donor_name: donor_name as string,
            ngo_id: ngo_id as string,
            worker_name: worker_name as string
        })

        return res.status(200).render("views/donations/search-donations", {donations, sum, ngo, search_terms})
    }
}

export { ListDonationsController }
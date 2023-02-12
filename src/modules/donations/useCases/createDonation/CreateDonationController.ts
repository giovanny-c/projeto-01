import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateDonationUseCase } from "./CreateDonationUseCase";


class CreateDonationController {

    async handle(req: Request, res: Response): Promise<any> {


        let { donation_value, donor_name, worker_id, is_payed, payed_at } = req.body
        const { id: user_id } = req.user
        const {id: ngo_id} = req.params

        //remove a mascara do front e transforma para float com "."
        donation_value = donation_value.replace(/(?!\,+)[\D]/g,"").replace(/\,/,".") as string
       
        

        const createDonationUseCase = container.resolve(CreateDonationUseCase)



        const {donation} = await createDonationUseCase.execute({ 
            ngo_id, 
            donor_name,
            user_id, 
            worker_id,
            donation_value: +(donation_value), 
            is_payed, 
            payed_at, 
        })

        return res.status(201).redirect(`/instituicao/${donation.ngo.id}/doacao/${donation.donation_number}`)

    }
}

export { CreateDonationController }
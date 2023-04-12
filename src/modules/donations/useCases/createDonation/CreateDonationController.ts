import { container } from "tsyringe";
import { Request, Response } from "express";
import { CreateDonationUseCase } from "./CreateDonationUseCase";
import validateFields from "./validateFields";
import { AppError } from "../../../../shared/errors/AppError";


class CreateDonationController {

    async handle(req: Request, res: Response): Promise<any> {


        let { donation_value, donor_name, worker_id, is_payed, payed_at } = req.body
        const { id: user_id } = req.user
        const {ngo_id} = req.params


        //por esses replaces no front?
        //remove a mascara do front e transforma para float com "."
        //e transforma em numero
        donation_value = +(donation_value.replace(/(?!\,+)[\D]/g,"").replace(/\,/,".") as string ) 
       
        
        const {error, value} = validateFields({donation_value, donor_name, worker_id, ngo_id, user_id})

        if(error){

            throw new AppError(error)

        //     return res.status(400).render("views/donations/create-donation", {
        //         error, 
        //     })
        }
       
        
        const createDonationUseCase = container.resolve(CreateDonationUseCase)



        const {donation} = await createDonationUseCase.execute({ 
            ngo_id, 
            donor_name,
            user_id, 
            worker_id,
            donation_value, 
            is_payed, 
            payed_at, 
        })

        return res.status(201).redirect(`/instituicao/${donation.ngo.id}/doacao/${donation.donation_number}`)

    }
}

export { CreateDonationController }
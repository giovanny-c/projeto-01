import { container } from "tsyringe";
import { Request, Response } from "express";
import { UpdateDonationUseCase } from "./UpdateDonationUseCase";



class UpdateDonationController {

    async handle(req: Request, res: Response): Promise<any> {


        let {donation_id, donation_value, donor_name, worker_id, is_donation_canceled} = req.body
        const {ngo_id} = req.params

        //remove a mascara do front e transforma para float com "."
        donation_value = donation_value.replace(/(?!\,+)[\D]/g,"").replace(/\,/,".") as string
       
       
        
        const createDonationUseCase = container.resolve(UpdateDonationUseCase)



        const {donation, ngo} = await createDonationUseCase.execute({ 
            ngo_id, 
            donation_id,
            donor_name,     
            worker_id,
            is_donation_canceled,
            donation_value: +(donation_value),
        })

        return res.status(201).redirect(`/instituicao/${ngo.id}/doacao/${donation.donation_number}`)

    }
}

export { UpdateDonationController }
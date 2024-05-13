import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetDonationUseCase } from "./GetDonationUseCase";



class GetDonationController {
    
    
    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id, donation_number } = req.params

        const {id: user_id} = req.user

        const getDonationUseCase = container.resolve(GetDonationUseCase)
        
        const {donation, ngo, file_name, formated_value, formated_date, messages} = await getDonationUseCase.execute({ngo_id, donation_number: +(donation_number) || null})
    
        return res.status(200).render("views/donations/donation", {
            user_id, 
            formated_value, 
            formated_date, 
            donation, 
            file_name, 
            messages, 
            ngo, 
            ngos: req.ngos,
            username: req.user.name, 
            error: req.error, 
            success: req.success })
    }
}

export { GetDonationController } 
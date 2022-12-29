import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";

import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";


interface IRequest {
   new_donation_number: number
   ngo_id: string
}

@injectable()
class setDonationCounterUseCase {


    constructor(
       
        @inject("DonationCounterRepository")
        private donationCounterrepository: IDonationCounterRepository,
    ) { }

    async execute({ ngo_id, new_donation_number}: IRequest): Promise<void> {
        
        const {donation_number: old_donation_number} = await this.donationCounterrepository.findByNgoId(ngo_id)


        const res = await this.donationCounterrepository.update(ngo_id, new_donation_number, old_donation_number)


        console.log(res.donation_number)
        
        

        
        
        
        

    }

}

export { setDonationCounterUseCase }
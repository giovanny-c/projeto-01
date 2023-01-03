import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { DonationCounter } from "../../entities/donation_counter";

import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";


interface IRequest {
   new_donation_number: number
   ngo_id: string
}

@injectable()
class SetDonationCounterUseCase {


    constructor(
       
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
    ) { }

    async execute({ ngo_id, new_donation_number}: IRequest): Promise<DonationCounter | Partial<DonationCounter>> {
        
        const existCounter = await this.donationCounterRepository.findByNgoId(ngo_id)

        if(!existCounter){
    
            const res = await this.donationCounterRepository.create(ngo_id, new_donation_number)

            return res
            
        }

    

        const res = await this.donationCounterRepository.update(ngo_id, new_donation_number, existCounter.donation_number)

        

        return res

        
        
    
    }

}

export { SetDonationCounterUseCase }
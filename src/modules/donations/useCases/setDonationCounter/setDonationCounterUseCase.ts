import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { DonationCounter } from "../../entities/donation_counter";

import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";


interface IRequest {
   new_donation_number: number
   id: string
}

interface IResponse {
    ngo: Ngo
    counter: DonationCounter | Partial<DonationCounter>
}

@injectable()
class SetDonationCounterUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,

    ) { }

    async execute({ id, new_donation_number}: IRequest): Promise<IResponse> {
        
        const ngo =  await this.ngoRepository.findById(id)

        const existCounter = await this.donationCounterRepository.findByNgoId(ngo.id)

        let counter

        if(!existCounter){
    
            counter = await this.donationCounterRepository.create(ngo.id, new_donation_number)

            return {
                ngo,
                counter
            }
        }

    

       counter = await this.donationCounterRepository.update(ngo.id, new_donation_number, existCounter.donation_number)

        

        return  {
            ngo,
            counter
        }
        
    
    }

}

export { SetDonationCounterUseCase }
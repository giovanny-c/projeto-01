import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { DonationCounter } from "../../entities/donation_counter";

import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";


interface IRequest {
   id: string
}

interface IResponse {
    ngo: Ngo
    counter: DonationCounter | Partial<DonationCounter>
}

@injectable()
class LoadDonationCounterPageUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,

    ) { }

    async execute({ id}: IRequest): Promise<IResponse> {
        
        const ngo =  await this.ngoRepository.findById(id)

        const counter = await this.donationCounterRepository.findByNgoId(ngo.id)


        return  {
            ngo,
            counter
        }
        
    
    }

}

export { LoadDonationCounterPageUseCase }
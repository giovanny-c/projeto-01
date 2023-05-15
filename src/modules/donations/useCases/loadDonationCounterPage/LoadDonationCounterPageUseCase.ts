import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";

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
    ngo_donation_counter: DonationCounter | Partial<DonationCounter>
}

@injectable()
class LoadDonationCounterPageUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider

    ) { }

    async execute({id}: IRequest): Promise<IResponse> {
        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${id}`))

        if(!ngo || !ngo.id){
            ngo =  await this.ngoRepository.findById(id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }

        
        const donation_counter = await this.donationCounterRepository.findByNgoId(ngo.id)


        return  {
            ngo,
            ngo_donation_counter: donation_counter
        }
        
    
    }

}

export { LoadDonationCounterPageUseCase }
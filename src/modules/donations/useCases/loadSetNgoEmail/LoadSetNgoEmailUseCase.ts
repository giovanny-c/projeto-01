




import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";

import { AppError } from "../../../../shared/errors/AppError";
import { DonationCounter } from "../../entities/donation_counter";

import { Ngo } from "../../entities/ngos";
import { NgoEmail } from "../../entities/ngos_emails";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosEmailsRepository } from "../../repositories/INgosEmailRepository";


interface IRequest {
   ngo_id: string
}

interface IResponse {
    ngo: Ngo
    email: string
}

@injectable()
class LoadSetNgoEmailUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("NgosEmailsRepository")
        private ngosEmailsRepository: INgosEmailsRepository,

    ) { }

    async execute({ngo_id}: IRequest): Promise<IResponse> {
        
        let ngo = JSON.parse(await this.cacheProvider.getRedis(`ngo-${ngo_id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }


        const email = await this.ngosEmailsRepository.findAllfromNgo(ngo_id)
        console.log(email)

    
        return  {
            ngo,
            email: email[0].email
        }
        
    
    }

}

export { LoadSetNgoEmailUseCase }
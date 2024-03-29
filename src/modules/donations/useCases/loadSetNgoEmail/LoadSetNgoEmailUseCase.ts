
import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";

import { AppError } from "../../../../shared/errors/AppError";

import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosEmailsRepository } from "../../repositories/INgosEmailRepository";


interface IRequest {
   ngo_id: string
}


@injectable()
class LoadSetNgoEmailUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("NgosEmailsRepository")
        private ngosEmailsRepository: INgosEmailsRepository,

    ) { }

    async execute({ngo_id}: IRequest){
        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo || !ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }
        
        

        const email = await this.ngosEmailsRepository.findAllfromNgo(ngo_id)
        

    
        return  {
            ngo,
            email: email[0]?.email || null,
            host: email[0]?.host || null
        }
        
    
    }

}

export { LoadSetNgoEmailUseCase }
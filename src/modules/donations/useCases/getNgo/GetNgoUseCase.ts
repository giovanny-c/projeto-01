import { inject, injectable } from "tsyringe";
import { getExecutionTime } from "../../../../../utils/decorators/executionTime";
import { encrypt } from "../../../../../utils/passwordUtils";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { DonationCounter } from "../../entities/donation_counter";
import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IResponse {
    ngo: Ngo
    ngo_donation_counter: DonationCounter
}

@injectable()
class GetNgoUseCase {

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider
    ){

    }

    async execute(id: string){

        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }

        if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        const ngo_donation_counter = await this.donationCounterRepository.findByNgoId(ngo.id)



        return {ngo, ngo_donation_counter}


    }

    
}
export {GetNgoUseCase}
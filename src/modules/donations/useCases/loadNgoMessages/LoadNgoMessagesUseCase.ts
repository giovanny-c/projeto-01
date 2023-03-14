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
import { INgosMessagesRepository } from "../../repositories/INgosMessagesRepository";


@injectable()
class LoadNgoMessagesUseCase {

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("NgosMessagesRepository")
        private ngosMessagesRepository: INgosMessagesRepository,
        
    ){

    }

    async execute(ngo_id: string){

        const ngo = await this.ngoRepository.findById(ngo_id)
        const messages = await this.ngosMessagesRepository.findByNgoId(ngo_id)
        


        return {ngo, messages}


    }

    
}
export {LoadNgoMessagesUseCase}
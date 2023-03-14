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
class LoadNgoMessageUseCase {

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("NgosMessagesRepository")
        private ngosMessagesRepository: INgosMessagesRepository,
        
    ){

    }

    async execute(message_id: string){

        const message = await this.ngosMessagesRepository.findById(message_id)
        const ngo = await this.ngoRepository.findById(message.ngo_id)

        

        return {ngo, message}


    }

    
}
export {LoadNgoMessageUseCase}
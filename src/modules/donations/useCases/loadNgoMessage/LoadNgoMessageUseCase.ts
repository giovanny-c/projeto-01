import { inject, injectable } from "tsyringe";
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
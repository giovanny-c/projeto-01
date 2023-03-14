import { inject, injectable } from "tsyringe";

import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosMessagesRepository } from "../../repositories/INgosMessagesRepository";


@injectable()
class DeleteNgoMessageUseCase {

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("NgosMessagesRepository")
        private ngosMessagesRepository: INgosMessagesRepository,
        
    ){

    }

    async execute(message_id: string, ngo_id: string){

        await this.ngosMessagesRepository.delete(message_id, ngo_id)

        const ngo = await this.ngoRepository.findById(ngo_id)

        

        return {ngo}


    }

    
}
export {DeleteNgoMessageUseCase}
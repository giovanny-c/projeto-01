import { inject, injectable } from "tsyringe";
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
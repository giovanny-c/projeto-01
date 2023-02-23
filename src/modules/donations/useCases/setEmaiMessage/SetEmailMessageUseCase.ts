import { inject, injectable } from "tsyringe";
import { getFormatedDateForMessages } from "../../../../../utils/splitDateForReceipt";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";

import { AppError } from "../../../../shared/errors/AppError";

import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosMessagesRepository } from "../../repositories/INgosMessagesRepository";


interface IRequest {
    ngo_id: string
    subject: string
    name: string
    message: string
    // start_date: Date 
    // end_date: Date 
    
    
}



@injectable()
class SetEmailMessageUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("NgosMessagesRepository")
        private ngosMessagesRepository: INgosMessagesRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
        

    ) { }

    async execute({ ngo_id, name, message, subject}: IRequest) {

        if(!ngo_id){
            throw new AppError("Instituição nao encontrada.", 400)
        }
        if(!subject){
            throw new AppError("A mensagem precisa de um assunto.", 400)
        }
        
        

        const ngo =  await this.ngoRepository.findById(ngo_id)
        console.log(ngo)

        if(!ngo){
            throw new AppError("Instituição nao encontrada", 400)
        }

        

        await this.ngosMessagesRepository.create({
            name,
            ngo_id,
            subject,
            message,
            
        })

        return ngo
    }
}

export { SetEmailMessageUseCase }
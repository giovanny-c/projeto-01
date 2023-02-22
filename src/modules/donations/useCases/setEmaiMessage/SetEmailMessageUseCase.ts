import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";

import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosMessagesRepository } from "../../repositories/INgosMessagesRepository";


interface IRequest {
    ngo_id: string
    subject: string
    message: string
    end_day: string 
    end_month: string 
    start_day: string 
    start_month: string 
    
}



@injectable()
class SetEmailMessageUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("NgosMessagesRepository")
        private ngosMessagesRepository: INgosMessagesRepository,

    ) { }

    async execute({ ngo_id, message, subject, end_day, end_month, start_day, start_month}: IRequest) {

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

        //data dia/mes
        const start_date = `${start_day}/${start_month}`
        const end_date = `${end_day}/${end_month}`

        //como transformar isso em data?

        //fazer essa validação quando for
        //fazer as views

        console.log(start_date)

        // await this.ngosMessagesRepository.create({
        //     ngo_id,
        //     subject,
        //     message,
        //     start_date,
        //     end_date
        // })

        return ngo
    }
}

export { SetEmailMessageUseCase }
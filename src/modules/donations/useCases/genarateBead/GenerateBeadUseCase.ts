import {injectable, inject} from "tsyringe"
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

interface IRequest {
    first_number: number
    last_number: number
    ngo_id: string
}


@injectable()
class GenerateBeadUseCase {

    constructor(
        @inject("FileProvider")
        private fileProvider: IFileProvider,
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
    ){

    }


    async execute({first_number, last_number, ngo_id}: IRequest):Promise<void>{
    
        if(last_number - first_number < 0){
            throw new AppError("O numero inicial deve ser menor que o numero final", 400)
        }

        const donations = await this.donationsRepository.findForGenerateBead({
            donation_number_interval: [first_number, last_number],
            ngo_id
        })  

        console.log(donations[0])

        await this.fileProvider.createBead(donations)


    }
}

export {GenerateBeadUseCase}
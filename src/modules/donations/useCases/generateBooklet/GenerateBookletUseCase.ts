import {injectable, inject} from "tsyringe"
import { splitDate } from "../../../../../utils/splitDate";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

interface IRequest {
    first_number: number
    last_number: number
    ngo_id: string
}

interface IResponse {
    year,
    month
    file_name: string
}


@injectable()
class GenerateBookletUseCase {

    constructor(
        @inject("FileProvider")
        private fileProvider: IFileProvider,
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
    ){

    }


    async execute({first_number, last_number, ngo_id}: IRequest):Promise<IResponse>{
    
        if(last_number - first_number < 0){
            throw new AppError("O numero inicial deve ser menor que o numero final", 400)
        }

        const donations = await this.donationsRepository.findForGenerateBooklet({
            donation_number_interval: [first_number, last_number],
            ngo_id
        })  


        const {year, month} =  this.dateProvider.splitDate(this.dateProvider.dateNow())
        

        const {file_name} = await this.fileProvider.createBooklet(donations)

        return{
            year,
            month,
            file_name
        }
    }
}

export {GenerateBookletUseCase}
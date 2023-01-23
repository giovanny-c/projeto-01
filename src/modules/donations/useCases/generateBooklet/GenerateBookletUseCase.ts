import {injectable, inject} from "tsyringe"
import { splitDate } from "../../../../../utils/splitDate";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest {
    first_number: number
    last_number: number
    ngo_id: string
}

interface IResponse {
    ngo: Ngo
    year: string
    month: string
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
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ){

    }


    async execute({first_number, last_number, ngo_id}: IRequest):Promise<IResponse>{
        
        let ngo = JSON.parse(await this.cacheProvider.getRedis(`ngo-${ngo_id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }   


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
            ngo,
            year,
            month,
            file_name
        }   
    }
}

export {GenerateBookletUseCase}
import { inject, injectable } from "tsyringe";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { IDonationsRepository } from "../../../donations/repositories/IDonationsRepository";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { INgoRepository } from "../../../donations/repositories/INgoRepository";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { AppError } from "../../../../shared/errors/AppError";
import * as stream from "stream"


// interface IRequest {

//     file: string
    


// }

@injectable()
class GenerateFileUseCase {


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

    async execute(file: string, params: any){

       if(file === "booklet"){

        try {
            
            if(params.donation_number_interval[0] - params.donation_number_interval[1] < 0){
                return
            }

            const donations = await this.donationsRepository.findForGenerateBooklet({
                donation_number_interval: params.donation_number_interval,
                ngo_id: params.ngo_id
            })

            
            const {file, file_name, file_buffer} = await this.fileProvider.createBooklet(donations)
            
            const readable = stream.Readable.from(file_buffer)

            return {
                readable,
                file_name
            }


        } catch (error) {

            console.error(error)
            return
        }


       }
    }

    


    
    
}

export {GenerateFileUseCase}
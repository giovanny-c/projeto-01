import { inject, injectable } from "tsyringe";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { IDonationsRepository } from "../../../donations/repositories/IDonationsRepository";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { INgoRepository } from "../../../donations/repositories/INgoRepository";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { AppError } from "../../../../shared/errors/AppError";
import * as stream from "stream"


interface IRequest {

    file: string
    params: any

}

interface IResponse {

    readable: stream.Readable
    file_name: string
}

@injectable()
class GenerateFileUseCase {


    constructor(
        
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("FileProvider")
        private fileProvider: IFileProvider,
    ){

    }

    async execute({file, params}: IRequest): Promise<IResponse | void>{

            
        if(file === "booklet"){

           const [initial, final] = params.interval.slice(0,2)

           const {ngo_id} = params 
            
           return await this.generateBooklet([+(initial), +(final)], ngo_id )
        
        }   


        if(file === "receipt"){

        }


       

       
    }


    private async generateReceipt(donation_id: string, ngo_id: string){

        const donation = await this.donationsRepository.findOneById(donation_id)

    }

    private async generateBooklet( interval: number[], ngo_id: string ){
        try {
                
            if(interval[0] - interval[1]  < 0){
                return
            }

            const donations = await this.donationsRepository.findForGenerateBooklet({
                donation_number_interval: interval,
                ngo_id: ngo_id
            })
            
            
            const {file: pdfBytes} = await this.fileProvider.createBooklet(donations)
            
            
            const readable = stream.Readable.from(Buffer.from(pdfBytes))
            
            return {
                readable,
                file_name: `${interval[0]}__${interval[1]}.pdf`
            }
            
            // file_name: "file_name!
       
        } catch (error) {
            console.error(error)
            return     
        }
    }
    


    
    
}

export {GenerateFileUseCase}
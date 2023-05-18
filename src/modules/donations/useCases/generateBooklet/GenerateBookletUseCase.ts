import {injectable, inject} from "tsyringe"
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";
import stream from "stream"
import { Donation } from "../../entities/donation";

interface IRequest {
    donation_number_interval: [number, number]
    ngo_id: string
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


    async execute({donation_number_interval, ngo_id}: IRequest){
        
        try {
            
            
           
       
            let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`)) as Ngo

            if(!ngo || !ngo.id){
                ngo =  await this.ngoRepository.findById(ngo_id)

                

                if(!ngo) throw new AppError("Instituição nao encontrada", 404)

            }   
        
            if(donation_number_interval[1] - donation_number_interval[0]  < 0 || (isNaN(donation_number_interval[0])  ||  isNaN(donation_number_interval[1]) )){
                
                throw new AppError("O numero inicial deve ser menor que o final.", 400)
            }
            
            
            
            const donations = await this.donationsRepository.findForGenerateBooklet({
                donation_number_interval,
                ngo_id: ngo.id
            })
            

            if(!donations.length){
                
                throw new AppError("Nenhuma doação encontrada.", 404)
                
            }
            
            

            const {file: pdfBytes} = await this.fileProvider.createBooklet({
                donations, 
                saveFile: false})
            


            const file = stream.Readable.from(Buffer.from(pdfBytes))

            
            
            return {
                
                file,
                file_name: `${ngo.name}_${donation_number_interval[0]}__${donation_number_interval[1]}.pdf`,
                content_type: "application/pdf"
            
            }

        } catch (error) {
            
            throw new AppError(error.message || "Não foi posivel gerar o arquivo", error.statusCode || 500)
        }
        
            
       

         
    }
}

export {GenerateBookletUseCase}
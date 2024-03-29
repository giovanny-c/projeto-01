import { inject, injectable } from "tsyringe";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { IDonationsRepository } from "../../../donations/repositories/IDonationsRepository";

import * as stream from "stream"
import IResponse from "../dtos/IResponseDTO";
import { Donation } from "../../../donations/entities/donation";
import { INgosTemplateConfigRepository } from "../../../donations/repositories/INgosTemplateConfigRepository";
import { INGOtemplateConfig } from "../../../../shared/container/providers/fileProvider/INGOReceiptProvider";



interface IRequest {

    file: string
    params: any

}




@injectable()
class GenerateFileUseCase {


    constructor(
        
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("NgoTemplateConfigRepository")
        private ngoTemplateConfigRepository: INgosTemplateConfigRepository,
        @inject("FileProvider")
        private fileProvider: IFileProvider,
    ){

    }

    async execute({file, params}: IRequest): Promise<IResponse> {

        
        // if(file === "booklet"){



        //     try {
        //         const [initial, final] = params.interval.slice(0,2)

        //         const {ngo_id} = params 
            
            
        //         return await this.generateBooklet([+(initial), +(final)], ngo_id )
            
        //     } catch (error) {
                
        //         return {

        //             error:{
        //                 message: error.message || error,
        //                 status: error.status || 500
        //             }
                    
        //         }
        //     }
           
        
        // }   


        if(file === "receipt"){

            try {   
                
                const {donation_id} = params
                
                return await this.generateReceipt(donation_id)
            
            } catch (error) {
                
                return {
                    error:{
                        message: error.message || error,
                        status: error.status || 500
                    }
                }
            }


        }
       
        return {

            error: {
                message:  "Corpo da requisição invalido.",
                status: 400
            }
        }
           

       
    }


    private async generateReceipt(donation_id: string){
        

        if(!donation_id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)){
            

            return {
                error:{
                    message: "Tipo do id invalido.",
                    status: 400
                } 
            } 
        }
        

        try {
            
            const donation = await this.donationsRepository.findOneById(donation_id) as Donation

            if(!donation.ngo?.template_name){
                
                return {
                    error: {
                        message: "Não Foi possivel gerar esse arquivo. Ele não possui um template ou não foi encontrado!",
                        status: 500
                    }
                } 
                
            }


            const template_config = await this.ngoTemplateConfigRepository.findByNgoId(donation.ngo.id)

            if(!template_config){
                return {
                    error: {
                        message: "Não Foi possivel gerar esse arquivo. Ele não possui uma configuração de template!",
                        status: 500
                    }
                } 
            }

            let config =  JSON.parse(template_config.configuration) as INGOtemplateConfig

            const pdfBytes = await this.fileProvider.generateFile({
                donation, 
                saveFile: false,
                generateForBooklet: false,
                template_config: config,
                template_name: donation.ngo.template_name
            }) as Buffer
            

            let file_name = `${donation.donor_name}_${donation.donation_number}_${donation.ngo.name}.pdf`.replace(/[\\\/:*?<>|",]/g, "")

        
            const readable = stream.Readable.from(Buffer.from(pdfBytes))
            
            return {
                response: {
                    readable,
                    file_name,
                    content_type: "application/pdf"
                }
            }


        } catch (error) {
            console.error(error)
            return {
                error:{
                    message: "Não foi possivel gerar o recibo.",
                    status: 500
                } 
            }
        }

        
    }

    // private async generateBooklet( interval: number[], ngo_id: string ){
        
    //     if(!ngo_id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)){
            

    //         return {

    //             error: {
    //                 message: "Tipo do id invalido.",
    //                 status: 400
    //             }
    //         } 
    //     }
            
    //     if(interval[1] - interval[0]  < 0 || (typeof interval[0] !== "number" || typeof interval[1] !== "number" )){
    //         return {
    //             error: {
    //                 message: "O numero inicial deve ser menor que o numero final.",
    //                 status: 400
    //             }
    //         } 
             
    //     }

    //     const donations = await this.donationsRepository.findForGenerateBooklet({
    //         donation_number_interval: interval,
    //         ngo_id: ngo_id
            
    //     })

        

    //     if(!donations.length){
            
            
    //         return {
    //             error: {
    //                 message: "Nenhuma Doação encontrada.",
    //                 status: 400
    //             }
    //         } 
            
    //     }
        
        
    //     const {file: pdfBytes} = await this.fileProvider.createBooklet({
    //         donations, 
    //         saveFile: false})
        


    //     const readable = stream.Readable.from(Buffer.from(pdfBytes))
        
    //     return {
    //         response: {
    //             readable,
    //             file_name: `${interval[0]}__${interval[1]}.pdf`,
    //             content_type: "application/pdf"
    //         }
    //     }
        
            
       
        
    // }
    


    
    
}

export {GenerateFileUseCase}
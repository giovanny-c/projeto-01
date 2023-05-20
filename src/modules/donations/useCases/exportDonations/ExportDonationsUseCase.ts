import { inject, injectable } from "tsyringe";
import * as xlsx from "xlsx"
import stream from "stream"
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { error } from "pdf-lib";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { INgoRepository } from "../../repositories/INgoRepository";
import { Ngo } from "../../entities/ngos";
import { IXlsxParserProvider } from "../../../../shared/container/providers/xlsxParserProvider/IXlsxParserProvider";
import { Donation } from "../../entities/donation";

interface IRequest {
    ngo_id: string
    donation_number_interval: [number, number]
}


@injectable()
class ExportDonationsUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("XlsxParserProvider")
        private xlsxParserProvider: IXlsxParserProvider
    ){

    }

    async execute({donation_number_interval, ngo_id }: IRequest){


        try {


            let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`)) as Ngo

            if(!ngo || !ngo.id){
                ngo =  await this.ngoRepository.findById(ngo_id)

                

                if(!ngo) throw new AppError("Instituição nao encontrada", 404)

            }   

            if(donation_number_interval[1] - donation_number_interval[0]  < 0 || (isNaN(donation_number_interval[0])  ||  isNaN(donation_number_interval[1]) )){
                
                throw new AppError("O numero inicial deve ser menor que o final.", 400)
            }
            


            const donation_sheet = await Promise.all(
                (await this.donationsRepository.findForGenerateBooklet({
                    donation_number_interval, ngo_id
                })).map( (donation) => {
                    
                    return {
                        instituicao: donation.ngo?.name || null,
                        numero: donation.donation_number || null,
                        valor: donation.donation_value || null,
                        doador: donation.donor_name || null,
                        funcionario: donation.worker?.name || null,
                        data: donation.created_at || null, //como a data vai sair?
                        data_de_criacao: donation.payed_at || null,
                        cancelada: donation.is_donation_canceled ? "SIM" : "NÃO",
                        email_enviado: donation.is_email_sent ? "SIM" : "NÃO"

                    }
                })
            ).catch(error => { 
                console.error(error)
                throw new AppError("Erro ao procurar doações", 500)
            })

            if(donation_sheet.length <= 0 ){
                throw new AppError("Nenhuma doação encontrada.", 404)
            }
                

            const sheetName = "Doações"
            const file_name = `${donation_sheet[0].instituicao}-doações-${donation_number_interval[0]}-${donation_number_interval[1]}.xlsx`
            
            const file = this.xlsxParserProvider.objectToXlsx(donation_sheet, {dateNF: "dd/mm/yyyy"}, sheetName)
        
            

            return{ 
                file: stream.Readable.from(file),
                file_name
            }
                
        } catch (error) {

            
            throw new AppError(error.message || "Não foi posivel gerar o arquivo", error.statusCode || 500)
        }

    }




}

export {
    ExportDonationsUseCase
}
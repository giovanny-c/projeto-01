import { inject, injectable } from "tsyringe";
import * as xlsx from "xlsx"
import stream from "stream"
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

interface IRequest {
    ngo_id: string
    donation_number_interval: [number, number]
}


@injectable()
class ExportDonationsUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
    ){

    }

    async execute({donation_number_interval,ngo_id }: IRequest){

        try {

            
            
        // pegar do front dps
        
            

            const donations = await Promise.all(
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
            ) 
            
            
            const workSheet = xlsx.utils.json_to_sheet(donations, {
                dateNF: "dd/mm/yyyy",
                
            })
            
            const workBook = xlsx.utils.book_new()

            xlsx.utils.book_append_sheet(workBook, workSheet, "Doações")

            const file_name = `${donations[0].instituicao}-doações-${donation_number_interval[0]}-${donation_number_interval[1]}.xlsx`
            
            const file = xlsx.writeXLSX(
               workBook
               , {
                   type: "buffer",
                   bookType: "xlsx",
                   
            }) as Buffer
            

            return{ 
                file: stream.Readable.from(file),
                file_name
            }
            
        } catch (error) {
            console.error(error)
        }

    }




}

export {
    ExportDonationsUseCase
}
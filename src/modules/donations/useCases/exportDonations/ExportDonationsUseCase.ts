import { createWriteStream } from "fs";
import { inject, injectable } from "tsyringe";
import * as xlsx from "xlsx"
import stream from "stream"
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { Index } from "typeorm";


@injectable()
class ExportDonationsUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
    ){

    }

    async execute(){

        try {
            
        // pegar do front dps
            const body = {
                dni: [1000,1100],
                ni: "9a543ae0-6ea2-4eef-b3de-623ad77af6ed"
            }

            const donations = await Promise.all(
                (await this.donationsRepository.findForGenerateBooklet({
                    donation_number_interval: body.dni, ngo_id: body.ni
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

            
            const file = xlsx.writeXLSX(
               workBook
                , {
                type: "buffer",
                bookType: "xlsx",
                
            }) as Buffer


            return stream.Readable.from(file)
                
        } catch (error) {
            console.error(error)
        }

    }




}

export {
    ExportDonationsUseCase
}
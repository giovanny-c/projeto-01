import { inject, injectable } from "tsyringe";
import stream from "stream"
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { AppError } from "../../../../shared/errors/AppError";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { INgoRepository } from "../../repositories/INgoRepository";
import { Ngo } from "../../entities/ngos";
import { IXlsxParserProvider } from "../../../../shared/container/providers/xlsxParserProvider/IXlsxParserProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { Donation } from "../../../../modules/donations/entities/donation";

interface IRequest {
    ngo_id: string
    donation_number_interval?: [number, number],
    date_interval?: {
        startDate: string | Date,
        endDate: string | Date
    }
    
    worker_id?: string
    for_balance: boolean
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
        private xlsxParserProvider: IXlsxParserProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
    ){

    }

    async execute({donation_number_interval, ngo_id, date_interval, worker_id, for_balance }: IRequest){


        try {


            let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`)) as Ngo

            if(!ngo || !ngo.id){
                ngo =  await this.ngoRepository.findById(ngo_id)

                

                if(!ngo) throw new AppError("Instituição nao encontrada", 404)

            }   

            //para pegar por data
            let donations: Donation[]
            let fileName

            let {startDate, endDate} = date_interval

         
            if(this.dateProvider.isValidDate(startDate) || this.dateProvider.isValidDate(endDate)){

        
                if(!startDate){
                    startDate = this.dateProvider.dateNow()
                }

                !endDate ? endDate = this.dateProvider.dateNow() :  endDate = this.dateProvider.addOrSubtractTime("add", "second", 86399, endDate)

                
                //se tiver worker id passa tbm
                donations = await this.donationsRepository.findDonationsBy({ngo_id, startDate: startDate as Date, endDate: endDate as Date, orderBy: "ASC", worker_id}) as Donation[]
                
                //se for para o balanço tira as canceladas
                if(for_balance){
                    donations = donations.filter(donation => donation.is_donation_canceled === false)
                }
                
                if(!donations.length){
                    throw new AppError("Nenhuma doação encontrada para esse periodo de tempo.")
                }
            
                
                //se houver um worker id poe o nome no file name
                worker_id ? 
                    fileName = `${donations[0].worker.name}_${ngo.name}_${this.dateProvider.formatDate(startDate as Date, "DD-MM-YY")}__${this.dateProvider.formatDate(endDate as Date, "DD-MM-YY")}` 
                    : 
                    fileName = `${ngo.name}_planilha_doações_${this.dateProvider.formatDate(startDate as Date, "DD-MM-YY")}__${this.dateProvider.formatDate(endDate as Date, "DD-MM-YY")}`


                
                
            }///////////
            else{//pega por numeraçao

                if(donation_number_interval[1] - donation_number_interval[0]  < 0 || (isNaN(donation_number_interval[0])  ||  isNaN(donation_number_interval[1]) )){
                    
                    throw new AppError("O numero inicial deve ser menor que o final.", 400)
                }

                donations = await this.donationsRepository.findForGenerateBooklet({
                    donation_number_interval, ngo_id
                }) as Donation[]

                fileName
            
            }

            
            let donation_sheet

            if(for_balance){
                donation_sheet = donations.map((donation) => {
                    
                    return {
                        instituicao: donation.ngo?.name || null,
                        numero: donation.donation_number || null,
                        valor: donation.donation_value || null,
                        doador: donation.donor_name || null,
                        funcionario: donation.worker?.name || null,
                        data: donation.created_at || null, //como a data vai sair?
                        data_de_criacao: donation.payed_at || null,
                        
                        

                    }
                })

            }else{
                donation_sheet = donations.map((donation) => {
                    
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
            }
            
            

            if(donation_sheet.length <= 0 ){
                throw new AppError("Nenhuma doação encontrada.", 404)
            }
                

            const sheetName = "Doações"
            const file_name = fileName? `${fileName}.xlsx` : `${donation_sheet[0].instituicao}_planilha_doações_${donation_number_interval[0]}__${donation_number_interval[1]}.xlsx`
            
            const file = this.xlsxParserProvider.objectToXlsx(donation_sheet, {dateNF: "dd/mm/yyyy"}, sheetName/*, true*/)
        
            

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
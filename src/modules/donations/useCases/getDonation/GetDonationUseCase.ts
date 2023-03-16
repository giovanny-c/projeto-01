
import { inject, injectable } from "tsyringe";
import formatToBRL from "../../../../../utils/formatToBRL";
import { getFormatedDateForReceipt } from "../../../../../utils/splitDateForReceipt";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";

import { AppError } from "../../../../shared/errors/AppError";
import { Donation } from "../../entities/donation";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";
import path from "path"
import { INgosMessagesRepository } from "../../repositories/INgosMessagesRepository";
import { NgosMessagesRepository } from "../../repositories/implementation/NgosMessagesRepository";
import { NgoMessage } from "../../entities/ngos_messages";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { Donor } from "../../../donor/entities/donor";

interface IRequest{
    ngo_id: string
    donation_number: number
}

interface IResponse {
    formated_value: string
    formated_date: Date 
    donation: Donation,
    file?: string | Buffer
    file_name?: string
    ngo: Ngo
    messages: NgoMessage[]
    donor?: Donor
}


@injectable()
class GetDonationUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("FileProvider")
        private fileProvider: IFileProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,    
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        @inject("NgosMessagesRepository")
        private ngosMessagesRepository: INgosMessagesRepository,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
    ) {

    }

    async execute({donation_number, ngo_id}: IRequest): Promise<IResponse> {

        let ngo: Ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }

        let donation: Donation

        if(donation_number){
            
            donation = await this.donationsRepository.findDonationByNumberAndNgoId({donation_number, ngo_id})


        }else{

            const donations = await this.donationsRepository.findDonationsBy({ngo_id, orderBy: "DESC"})

            donation = donations[0]
        }


        if (!donation || !donation.id) {
            throw new AppError("Doação nao encontrada", 404)
        }

        if(donation.ngo_id !== ngo.id){
            throw new AppError("Doacão nao encontrada, ou nao existe", 400)
        }

        

        //se existir um donor com o mesmo nome passa ele para o get donation
        //para colocar no campo de email o donor.email
        //SE for fazer a pesquisa em tempo real pros donors, na hora de criar a donation
        const donorExists = await this.donorsRepository.findByName(donation.donor_name)
        
        //pegas as msgs de email
        const ngo_messages = await this.ngosMessagesRepository.findByNgoId(ngo_id)



        const {dia, mes , ano} = getFormatedDateForReceipt(donation.created_at)
        
        let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`

        let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`

        let file = await this.storageProvider.getFile(dir, file_name, true)
        

        if(!file){ // se nao tiver encontrado o arquivo

            try {
                
                const uint8Array = await this.fileProvider.generateFile(donation, true)

                if(!uint8Array){ // se nao tiver template vai retornar sem file
                    return {
                        formated_value: formatToBRL(donation.donation_value),
                        formated_date: this.dateProvider.formatDate(donation.created_at, "DD/MM/YYYY"),
                        donation,
                        ngo,
                        messages: ngo_messages,
                        donor: donorExists || undefined
                    
                    }
                }

                //se tiver vai pegar e transformar em base64
                file = Buffer.from(uint8Array)

                file = file.toString("base64")
                
            } catch (error) {
                console.error(error)
                throw new AppError("Nao foi possivel gerar o recibo dessa doação", 500)

            }

        }

        const formatedDate = this.dateProvider.formatDate(donation.created_at, "DD/MM/YYYY")
console.log(formatedDate)
    
        return {
            formated_value: formatToBRL(donation.donation_value),
            formated_date: formatedDate,
            donation,
            ngo,
            file,
            file_name: `${donation.donor_name}_${formatedDate}_${donation.donation_number}_${ngo.name}`,
            messages: ngo_messages,
            donor: donorExists || undefined
        }
    }


}

export { GetDonationUseCase }
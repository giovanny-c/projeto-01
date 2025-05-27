
import { inject, injectable } from "tsyringe";
import formatToBRL from "../../../../utils/formatToBRL";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";

import { AppError } from "../../../../shared/errors/AppError";
import { Donation } from "../../entities/donation";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosMessagesRepository } from "../../repositories/INgosMessagesRepository";
import { NgoMessage } from "../../entities/ngos_messages";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { Donor } from "../../../donor/entities/donor";

interface IRequest{
    ngo_id: string
    donation_number?: number
}

interface IResponse {
    formated_value: string
    formated_date: Date 
    donation: Donation,
    // file?: boolean
    // file_path?: string
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

        if(!ngo || !ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }

        let donation: Donation

        if(donation_number){
            
            donation = await this.donationsRepository.findDonationByNumberAndNgoId({donation_number, ngo_id})

        }
        if(!donation_number){

            const donations = await this.donationsRepository.findDonationsBy({ngo_id, orderBy: "DESC"})

            donation = donations[0]
        }


        if (!donation || !donation.id) {
            throw new AppError("Doação nao encontrada", 404)
        }

        if(donation.ngo_id !== ngo.id){
            throw new AppError("Doacão nao encontrada, ou nao existe", 400)
        }

// console.log(donation)

        //se existir um donor com o mesmo nome passa ele para o get donation
        //para colocar no campo de email o donor.email
        //SE for fazer a pesquisa em tempo real pros donors, na hora de criar a donation
        const donorExists = await this.donorsRepository.findByName(donation.donor_name)
        
        //pegas as msgs de email
        const ngo_messages = await this.ngosMessagesRepository.findByNgoId(ngo_id)



        // const {dia, mes , ano} = getFormatedDateForReceipt(donation.created_at)
        
        // let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`
        
        // let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`
        
        // let file_path = path.resolve(dir, file_name)

        // let file = await this.storageProvider.getFile(dir, file_name, true)
        
        // let file = true
        // //  ve se tem o arquivo
        // try {
        //     //le o arquivo e lança o erro se não existir
        //     await fs.promises.access(file_path)
            
        // } catch (error) {

        //     //vai tentar gerar o arquivo, se nao conseguir file = false
        //     !await this.fileProvider.generateFile(donation, true)? file = false : file = true
            
            
        // }
        
        
        const formatedDate = this.dateProvider.formatDate(donation.created_at, "DD/MM/YYYY")

        
        return {
            formated_value: formatToBRL(donation.donation_value),
            formated_date: formatedDate,
            donation,
            ngo,
            messages: ngo_messages,
            donor: donorExists || undefined,
            file_name: `${donation.donor_name}_${formatedDate}_${donation.donation_number}_${ngo.name}.pdf`,
            // file_path
            // file,
        }
    }


}

export { GetDonationUseCase }
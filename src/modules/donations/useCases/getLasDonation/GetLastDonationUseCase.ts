
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

interface IRequest{
    ngo_id: string
}

interface IResponse {
    formated_value: string
    formated_date: Date 
    donation: Donation,
    file: string | Buffer
    file_name: string
    ngo: Ngo
}


@injectable()
class GetLastDonationUseCase {

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
        private storageProvider: IStorageProvider
    ) {

    }

    async execute({ngo_id}: IRequest): Promise<IResponse> {

        let ngo: Ngo = JSON.parse(await this.cacheProvider.getRedis(`ngo-${ngo_id}`))

        if(!ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }


        const donations = await this.donationsRepository.findDonationsBy({ngo_id, orderBy: "DESC"})

        const donation = donations[0]

        if (!donation && !donation.id) {
            throw new AppError("Doação nao encontrada", 404)
        }

        if(donation.ngo_id !== ngo.id){
            throw new AppError("Doacão nao encontrada, ou nao existe", 400)
        }


        const {dia, mes , ano} = getFormatedDateForReceipt(donation.created_at)
        
        let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`
        let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`

        let file = await this.storageProvider.getFile(dir, file_name, true)

        if(!file){

           file = Buffer.from(await this.fileProvider.generateFile(donation, true))

           file = file.toString("base64")
        }

        

        return {
            formated_value: formatToBRL(donation.donation_value),
            formated_date: this.dateProvider.formatDate(donation.created_at, "DD/MM/YYYY"),
            donation,
            ngo,
            file,
            file_name: `${ngo.name}_${donation.donation_number}_${donation.donor_name}`
        }
    }


}
export { GetLastDonationUseCase }

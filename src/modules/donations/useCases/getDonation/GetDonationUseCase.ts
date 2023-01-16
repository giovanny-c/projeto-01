
import { inject, injectable } from "tsyringe";
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
    donation_id: string
}

interface IResponse {
    donation: Donation,
    file: string | Buffer
    file_name: string
    ngo: Ngo
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
        private storageProvider: IStorageProvider
    ) {

    }

    async execute({donation_id, ngo_id}: IRequest): Promise<IResponse> {

        let ngo: Ngo = JSON.parse(await this.cacheProvider.getRedis(`ngo-${ngo_id}`))

        if(!ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }


        const donation = await this.donationsRepository.findOneById(donation_id)

        if (!donation) {
            throw new AppError("Doação nao encontrada", 404)
        }

        if(donation.ngo_id !== ngo.id){
            throw new AppError("Doacão nao encontrada, ou nao existe", 400)
        }


        const {dia, mes , ano} = getFormatedDateForReceipt(donation.created_at)
        
        let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`
        let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`

        const file = await this.storageProvider.getFile(dir, file_name, true) as string | Buffer


        return {
            donation,
            ngo,
            file,
            file_name: `${ngo.name}_${donation.donation_number}_${donation.donor_name}`
        }
    }


}

export { GetDonationUseCase }
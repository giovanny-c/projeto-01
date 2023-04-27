import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Donation } from "../../entities/donation";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";


interface IResponse {
    donation: Donation
    ngo: Ngo
}

@injectable()
class CancelDonationUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("FileProvider")
        private fileProvider: IFileProvider,
        
    ) {

    }

    async execute(ngo_id: string, donation_number): Promise<IResponse> {

        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }   


        const donationExists = await this.donationsRepository.findDonationByNumberAndNgoId({donation_number, ngo_id})

        if (!donationExists) {
            throw new AppError("Essa doação nao existe", 400)
        }

        if (donationExists.is_donation_canceled === true) {
            throw new AppError("Essa doação ja foi cancelada", 400)
        }

        // if (donationExists.is_payed === true) {
        //     throw new AppError("This donation cant be canceled, because is already payed")
        // }

        await this.donationsRepository.markDonationAsCanceled(donationExists.id)

        
        await this.fileProvider.generateFile({...donationExists, is_donation_canceled: true}, false)


        return {
            donation: donationExists,
            ngo
        }

    }
}

export { CancelDonationUseCase }
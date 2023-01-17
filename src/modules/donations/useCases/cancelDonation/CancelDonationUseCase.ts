import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { Donation } from "../../entities/donation";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

@injectable()
class CancelDonationUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository
    ) {

    }

    async execute(ngo_id: string, donation_number): Promise<Donation> {

       

        const donationExists = await this.donationsRepository.findOneById(donation_number)

        if (!donationExists) {
            throw new AppError("Essa doação nao existe", 400)
        }

        if (donationExists.is_donation_canceled === true) {
            throw new AppError("Essa doação ja foi cancelada", 400)
        }

        // if (donationExists.is_payed === true) {
        //     throw new AppError("This donation cant be canceled, because is already payed")
        // }

        const donation = await this.donationsRepository.MarkDonationAsCanceled(donationExists.id)



        return donation

    }
}

export { CancelDonationUseCase }
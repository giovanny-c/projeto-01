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

    async execute(id: string, confirmation: boolean): Promise<Donation> {

        if (confirmation !== true) {
            throw new AppError("this operation was not complete")
        }

        const donationExists = await this.donationsRepository.findOneById(id)

        if (!donationExists) {
            throw new AppError("this donations does not exists")
        }

        if (donationExists.is_donation_canceled === true) {
            throw new AppError("This donation was canceled already")
        }

        const donation = await this.donationsRepository.MarkDonationAsCanceled(id, confirmation)



        return donation

    }
}

export { CancelDonationUseCase }
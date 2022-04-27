import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { Donation } from "../../entities/donation";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

@injectable()
class UpdateDonationStatusUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider

    ) {

    }

    async execute(donation_id: string): Promise<Donation> {

        const payedAt = this.dateProvider.dateNow()

        const donationExists = await this.donationsRepository.findOneById(donation_id)

        if (!donationExists) {
            throw new AppError("This donation does not exists")
        }

        if (donationExists.is_donation_canceled === true) {
            throw new AppError("This donation was canceled")
        }

        if (donationExists.is_payed === true) {
            throw new AppError("This donation was already payed")
        }


        await this.donorsRepository.create({
            id: donationExists.donor_id,
            last_donation: this.dateProvider.dateNow()
        })

        const payedDonation = await this.donationsRepository.MarkDonationAsPayed(donationExists, payedAt)

        return payedDonation
    }
}

export { UpdateDonationStatusUseCase }
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import { Donation } from "../../../donations/entities/donation";
import { IDonationsRepository } from "../../../donations/repositories/IDonationsRepository";
import { Donor } from "../../entities/donor";

interface IResponse {

    donor: Donor
    donations: Donation[]

}

@injectable()
class GetDonorAndDonationsUseCase {
    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository

    ) { }

    async execute(donor_id: string): Promise<IResponse> {

        const donorExists = await this.donorsRepository.findById(donor_id)

        if (!donorExists) {
            throw new AppError("This donor does not exists or its a invalid id")
        }

        const donations = await this.donationsRepository.findDonationsByDonorId(donorExists.id)

        const results = {
            donor: donorExists,
            donations
        }
        return results

    }
}

export { GetDonorAndDonationsUseCase }
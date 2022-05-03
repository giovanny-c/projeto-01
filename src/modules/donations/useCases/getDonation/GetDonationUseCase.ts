
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { Donation } from "../../entities/donation";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

@injectable()
class GetDonationUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
    ) {

    }

    async execute(id: string): Promise<Donation> {

        const donation = await this.donationsRepository.findOneById(id)


        if (!donation) {
            throw new AppError("This donation does not exists")
        }

        return donation
    }


}

export { GetDonationUseCase }
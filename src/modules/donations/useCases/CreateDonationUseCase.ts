import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IDonationsRepository } from "../repositories/IDonationsRepository";

@injectable()
class CreateDonationUseCase {


    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository) { }

    async execute({ donor_id, user_id, donation_value }: ICreateDonationsDTO): Promise<void> {

        const userExists = await this.donationsRepository.findBy("user_id", user_id)
        const donorExists = await this.donationsRepository.findBy("donor_id", donor_id)

        if (!userExists) {
            throw new AppError("This user does not exists")

        }

        if (!donorExists) {
            throw new AppError("This donor does not exists")

        }

        await this.donationsRepository.create({ donor_id, user_id, donation_value })

    }

}

export { CreateDonationUseCase }
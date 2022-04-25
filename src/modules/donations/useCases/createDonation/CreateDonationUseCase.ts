import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

@injectable()
class CreateDonationUseCase {


    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepopitory")
        private usersRepository: IUsersRepository
    ) { }

    async execute({ donor_id, user_id, donation_value }: ICreateDonationsDTO): Promise<void> {

        const userExists = await this.usersRepository.findById(user_id)
        const donorExists = await this.donorsRepository.findById(donor_id)

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
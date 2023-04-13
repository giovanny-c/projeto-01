import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import { Donation } from "../../../donations/entities/donation";
import { IDonationsRepository } from "../../../donations/repositories/IDonationsRepository";
import { Donor } from "../../entities/donor";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";



@injectable()
class GetDonorAndDonationsUseCase {
    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository

    ) { }

    async execute(donor_id: string){

        const donorExists = await this.donorsRepository.findById(donor_id)

        if (!donorExists) {
            throw new AppError("Doador nao encontrado", 404)
        }

        const user = await this.usersRepository.findById(donorExists.user_id)



       // const donations = await this.donationsRepository.findDonationsByDonorId(donorExists.id)

        

        const results = {
            donor: donorExists,
            worker: user.worker
            //donations
        }
        return results

    }
}

export { GetDonorAndDonationsUseCase }
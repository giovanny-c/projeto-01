import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

@injectable()
class CreateDonationUseCase {


    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute({ donor_id, user_id, donation_value }: ICreateDonationsDTO, worker_name: string): Promise<void> {

        const userExists = await this.usersRepository.findById(user_id)
        const donorExists = await this.donorsRepository.findById(donor_id)
        const workerExists = await this.workersRepository.findByName(worker_name)

        if (!userExists) {
            throw new AppError("This user does not exists")

        }

        if (!donorExists) {
            throw new AppError("This donor does not exists")

        }

        if (!workerExists) {
            throw new AppError("This worker does not exists")

        }

        const created_at = this.dateProvider.dateNow()

        await this.donationsRepository.create({ donor_id, user_id, donation_value, worker_id: workerExists.id, created_at })

    }

}

export { CreateDonationUseCase }
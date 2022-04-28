import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

@injectable()
class ImportDonationsUseCase {

    // constructor(
    //     @inject("DonationsRepository")
    //     private donationsRepository: IDonationsRepository,
    //     @inject("DonorsRepository")
    //     private donorsRepository: IDonorsRepository,
    //     @inject("UsersRepository")
    //     private usersRepository: IUsersRepository,
    //     @inject("WorkersRepository")
    //     private workersRepository: IWorkersReposiroty,
    //     @inject("DayjsDateProvider")
    //     private dateProviderRepository: IDateProvider
    // ) {

    // }

    async execute(): Promise<void> {

    }

}

export { ImportDonationsUseCase }
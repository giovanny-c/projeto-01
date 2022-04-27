import { inject, injectable } from "tsyringe";
import { Donor } from "../../entities/donor";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";

@injectable()
class ListDonorsUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository
    ) {

    }

    async execute(value: string): Promise<Donor[]> {


        const donors = await this.donorsRepository.findBy(value)

        return donors
    }
}

export { ListDonorsUseCase }
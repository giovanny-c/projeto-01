import { inject, injectable } from "tsyringe";
import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";

import { IDonorsRepository } from "../../repositories/IDonorsRepository";

@injectable()
class CreateDonorUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository) { }

    async execute({ name, email, phone }: ICreateDonorDTO): Promise<void> {

        const donorAlreadyExists = this.donorsRepository.findByEmail(email)

        if (!donorAlreadyExists) {
            throw new Error("This donor already exists")

        }

        await this.donorsRepository.create({ name, email, phone })


    }

}

export { CreateDonorUseCase }
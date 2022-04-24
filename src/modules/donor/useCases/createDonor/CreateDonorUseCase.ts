import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
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
            throw new AppError("This donor already exists")

        }

        await this.donorsRepository.create({ name, email, phone })


    }

}

export { CreateDonorUseCase }
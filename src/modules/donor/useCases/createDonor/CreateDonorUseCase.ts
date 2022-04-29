import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { Donor } from "../../entities/donor";

import { IDonorsRepository } from "../../repositories/IDonorsRepository";

@injectable()
class CreateDonorUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository) { }

    async execute({ name, email, phone }: ICreateDonorDTO): Promise<Donor> {

        const donorAlreadyExists = this.donorsRepository.findByEmail(email)

        if (!donorAlreadyExists) {
            throw new AppError("This donor already exists")

        }

        if (!name || !email || !phone) {
            throw new AppError("Please fill all fields")
        }

        const donor = await this.donorsRepository.create({ name, email, phone })

        return donor

    }

}

export { CreateDonorUseCase }
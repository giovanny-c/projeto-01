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

    async execute({ name, email, phone, user_id}: ICreateDonorDTO) {

        

        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            throw new AppError("formato de Email invalido", 400)
        }

        if (!name || !email || !phone) {
            throw new AppError("Preencha todos os campos")
        }

        const donorAlreadyExists = await this.donorsRepository.findByEmail(email)

        if (donorAlreadyExists) {
            throw new AppError("Esse doador ja existe")

        }

        const donor = await this.donorsRepository.create({ name, email, phone, user_id })

        return {
            donor
        }

    }

}

export { CreateDonorUseCase }
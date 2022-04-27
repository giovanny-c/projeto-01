import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { Donor } from "../../entities/donor";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";

@injectable()
class UpdateDonorUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository
    ) {
    }

    async execute({ id, name, email, phone }: ICreateDonorDTO): Promise<Donor> {

        const donorExists = await this.donorsRepository.findById(id)

        if (!donorExists) {
            throw new AppError("This donor does not exists or its a invalid id")
        }
        console.log(`${name}-${email}-${phone}`)
        if (!name) name = donorExists.name
        if (!email) email = donorExists.email
        if (!phone) phone = donorExists.phone

        const donor = await this.donorsRepository.create({ id: donorExists.id, name, email, phone })


        return donor
    }
}

export { UpdateDonorUseCase }
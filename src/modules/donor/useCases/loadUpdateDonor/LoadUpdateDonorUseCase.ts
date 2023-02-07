import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { Donor } from "../../entities/donor";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";

@injectable()
class LoadUpdateDonorUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository
    ) {
    }

    async execute({ id }: ICreateDonorDTO): Promise<Donor> {

        const donor = await this.donorsRepository.findById(id)

        if (!donor) {
            throw new AppError("Doador nao encontrado", 404)
        }

        


        return donor
    }
}

export { LoadUpdateDonorUseCase }
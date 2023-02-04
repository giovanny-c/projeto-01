import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { Donor } from "../../entities/donor";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";

@injectable()
class DeleteDonorUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository
    ) {
    }

    async execute({ id}: ICreateDonorDTO){

        const donorExists = await this.donorsRepository.findById(id)

        if (!donorExists) {
            throw new AppError("Doador nao encontrado", 404)
        }

        await this.donorsRepository.delete(id)


        
    }
}

export { DeleteDonorUseCase }
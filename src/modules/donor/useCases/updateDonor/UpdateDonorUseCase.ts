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

    
        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            throw new AppError("formato de Email invalido", 400)
        }

        const donorExists = await this.donorsRepository.findById(id)

        if (!donorExists) {
            throw new AppError("Doador nao encontrado", 404)
        }

        if (!name) name = donorExists.name
        if (!email) email = donorExists.email
        if (!phone) phone = donorExists.phone

        phone = phone.replace(/(\+\d\d )/g, "").replace(/[\(\)]/g,"") //tira os () e o +55 se tiver

        const donor = await this.donorsRepository.create({ id: donorExists.id, name, email, phone })


        return donor
    }
}

export { UpdateDonorUseCase }
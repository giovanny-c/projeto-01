import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { Donor } from "../../entities/donor";

import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";

@injectable()
class CreateDonorUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
        ) { }

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

        const checkUser = await this.usersRepository.findById(user_id)

        if(!checkUser){
            throw new AppError("Usuário nao encontrado")
        }
        
        phone = phone.replace(/[\(\)]/g,"")

        const donor = await this.donorsRepository.create({ 
            name, 
            email, 
            phone, 
            user_id: checkUser.worker_id ? checkUser.id : null //se for um user sem worker_id
        })

        return {
            donor
        }

    }

}

export { CreateDonorUseCase }
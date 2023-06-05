import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { Donor } from "../../entities/donor";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { instanceToPlain } from "class-transformer";
import { User } from "../../../user/entities/user";
import { Worker } from "../../../workers/entities/worker";

interface IRequest{
    donor_id: string
    user_id: string
} 

interface IResponse {
    donor: Donor
    workers?: Worker[]
}

@injectable()
class LoadUpdateDonorUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ) {
    }

    async execute({donor_id, user_id}: IRequest): Promise<IResponse> {

        const donor = await this.donorsRepository.findById(donor_id)

        if (!donor) {
            throw new AppError("Doador nao encontrado", 404)
        }

        const user = instanceToPlain(await this.usersRepository.findById(user_id)) as User

        if(user.admin){

            const workers = await this.workersRepository.find()
            
            return {
                donor,
                workers

            } 

        }


        


        return {
            donor
        }
    }
}

export { LoadUpdateDonorUseCase }
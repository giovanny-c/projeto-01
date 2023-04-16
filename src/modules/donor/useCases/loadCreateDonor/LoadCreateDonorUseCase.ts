import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { instanceToPlain } from "class-transformer";
import { User } from "../../../user/entities/user";
import { Worker } from "../../../workers/entities/worker";

@injectable()
class LoadCreateDonorUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ){

    }

    async execute(user_id: string): Promise<void | Worker[]>{

        const user = instanceToPlain(await this.usersRepository.findById(user_id)) as User

        if(user.admin){

            return await this.workersRepository.find()

        }


    }

}

export {LoadCreateDonorUseCase}
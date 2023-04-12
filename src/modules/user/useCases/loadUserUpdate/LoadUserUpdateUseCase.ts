

import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

import { User } from "../../entities/user";
import { instanceToPlain } from "class-transformer";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";

interface IRequest {
    id: string
}

@injectable()
class LoadUserUpdateUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
        ) {
    }

    async execute({id}: IRequest) {

        const user = await this.usersRepository.findById(id)
        
        const workers = await this.workersRepository.find()
        
        return {
            user: instanceToPlain(user) as User,
            workers
        }
        
    }
}

export { LoadUserUpdateUseCase }


import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

import { User } from "../../entities/user";
import { instanceToPlain } from "class-transformer";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { Worker } from "../../../workers/entities/worker";

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
        
        const workers = instanceToPlain(await this.workersRepository.findWithRelations()) as Worker[]

        const filteredWorkers = workers.filter(worker => {
            
            if(worker.user && worker.user.id === user.id ){
                return worker
            }
            
            if(!worker.user){
                return worker
            }
        })

        
        return {
            user: instanceToPlain(user) as User,
            workers: filteredWorkers
        }
        
    }
}

export { LoadUserUpdateUseCase }
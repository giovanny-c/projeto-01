import { inject, injectable } from "tsyringe";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { instanceToPlain } from "class-transformer";
import { Worker } from "../../../workers/entities/worker";





@injectable()
class LoadCreateUserUseCase {

    constructor(
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ){

    }

    async execute(){
        const workers = instanceToPlain(await this.workersRepository.findWithRelations()) as Worker[]



//criar busca apenas por workers nao atribuidos
        return workers.filter(worker => !worker.user)

    }

}

export {LoadCreateUserUseCase}
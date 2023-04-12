import { inject, injectable } from "tsyringe";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";





@injectable()
class LoadCreateUserUseCase {

    constructor(
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ){

    }

    async execute(){
//criar busca apenas por workers nao atribuidos
        return await this.workersRepository.find()

    }

}

export {LoadCreateUserUseCase}
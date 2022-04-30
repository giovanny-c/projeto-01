import { inject, injectable } from "tsyringe";
import { Worker } from "../../entities/worker";
import { IWorkersReposiroty } from "../../repositories/IWorkersRepository";

@injectable()
class ListWorkersUseCase {

    constructor(
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ) {

    }


    async execute(): Promise<Worker[]> {


        const workers = await this.workersRepository.find()

        return workers


    }


}

export { ListWorkersUseCase }
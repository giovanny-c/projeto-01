import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IWorkersReposiroty } from "../../repositories/IWorkersRepository";

@injectable()
class CreateWorkerUseCase {

    constructor(
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ) {

    }


    async execute(name: string): Promise<void> {


        const worker = await this.workersRepository.findByName(name)

        if (worker) {
            throw new AppError("There is already a worker with this name")
        }

        await this.workersRepository.create(name)


    }


}

export { CreateWorkerUseCase }
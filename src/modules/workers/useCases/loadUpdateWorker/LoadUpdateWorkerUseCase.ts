import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { Worker } from "../../entities/worker";
import { IWorkersReposiroty } from "../../repositories/IWorkersRepository";

@injectable()
class LoadUpdateWorkerUseCase {

    constructor(
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ) {

    }


    async execute(id: string): Promise<Worker> {

        const worker = await this.workersRepository.findById(id)

        if (!worker) {
            throw new AppError("Funcionário nao encontrado", 404)
        }

        return worker


    }


}

export { LoadUpdateWorkerUseCase }
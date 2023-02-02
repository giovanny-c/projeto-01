import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IWorkersReposiroty } from "../../repositories/IWorkersRepository";

@injectable()
class DeleteWorkerUseCase {

    constructor(
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ) {

    }


    async execute(id: string): Promise<void> {

        
        const workerExists = await this.workersRepository.findById(id)
        
        if (!workerExists) {
            throw new AppError("Usuário nao foi encontrado", 404)
        }
        
        
        await this.workersRepository.delete(id)


    }


}

export { DeleteWorkerUseCase }
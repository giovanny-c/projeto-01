import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IWorkersReposiroty } from "../../repositories/IWorkersRepository";

@injectable()
class UpdateWorkerUseCase {

    constructor(
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ) {

    }


    async execute(id: string, name: string): Promise<void> {

        
        const workerExists = await this.workersRepository.findById(id)
        
        if (!workerExists) {
            throw new AppError("Usuário nao foi encontrado", 404)
        }
        
        if(name === "" || name === undefined){
            throw new AppError("Campo nome nao possui um valor")
        }
        
        await this.workersRepository.create(name, id)


    }


}

export { UpdateWorkerUseCase }
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

        if(!name){
            throw new AppError("Preencha todos os campos")
        }

        const worker = await this.workersRepository.findByName(name)

        if (worker) {
            throw new AppError("Ja existe um funcionario com esse nome")
        }

        await this.workersRepository.create(name)


    }


}

export { CreateWorkerUseCase }
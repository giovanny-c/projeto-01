import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Donation } from "../../../donations/entities/donation";
import { IDonationsRepository } from "../../../donations/repositories/IDonationsRepository";
import { Worker } from "../../entities/worker";
import { IWorkersReposiroty } from "../../repositories/IWorkersRepository";

interface IRequest {
  worker_id: string
}

interface IResponse {
    worker: Worker

}

@injectable()
class GetWorkerUseCase {

    constructor(
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty,
        // @inject("DayjsDateProvider")
        // private dateProvider: IDateProvider
      
    ) {

    }

    async execute( { worker_id }: IRequest): Promise<IResponse> {

        

        const worker = await this.workersRepository.findById(worker_id)

        if (!worker) {
            throw new AppError("Worker not found")
        }

        

        return {
            worker
          
        }

    }


}
export { GetWorkerUseCase }
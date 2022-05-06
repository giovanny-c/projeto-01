import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Donation } from "../../../donations/entities/donation";
import { IDonationsRepository } from "../../../donations/repositories/IDonationsRepository";
import { Worker } from "../../entities/worker";
import { IWorkersReposiroty } from "../../repositories/IWorkersRepository";

interface IRequest {
    orderBy: string
    limit: number
    offset: number
    startDate: string
    endDate: string
}

interface IResponse {
    worker: Worker
    donations: Donation[]
    totalValue
}

@injectable()
class WorkerContribuitionsUseCase {

    constructor(
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
    ) {

    }

    async execute(id: string, { startDate, endDate, orderBy, limit, offset }: IRequest): Promise<IResponse> {

        if (orderBy !== "ASC") orderBy = "DESC"



        if (!limit || limit === 0) limit = 10
        if (!offset) offset = 0

        //if (limit.valueOf !== Number) throw new AppError("this is not a valid limit")
        //if (offset.valueOf !== Number) throw new AppError("this is not a valid offset")


        //se nao tiver data inicial cria uma data 1 mes antes da atual
        if (!startDate) startDate = this.dateProvider.addOrSubtractTime("sub", "month", 1).toString()
        //se nao tiver data final cria uma do dia atual + 23:59 min
        if (!endDate) endDate = this.dateProvider.addOrSubtractTime("add", "minute", 1439).toString()

        let startD = this.dateProvider.convertToDate(startDate)
        let endD = this.dateProvider.addOrSubtractTime("add", "minute", 1439, this.dateProvider.convertToDate(endDate))

        //if (startD === endD) endD = this.dateProvider.addOrSubtractTime("add", "minute", 1439, endD)

        //if (this.dateProvider.IsToday(endD)) endD = this.dateProvider.addOrSubtractTime("add", "minute", 1439, endD)


        const worker = await this.workersRepository.findById(id)

        if (!worker) {
            throw new AppError("Worker not found")
        }

        const donations = await this.donationsRepository.findDonationsForWorker(
            id,
            {
                startDate: startD,
                endDate: endD,
                limit,
                offset,
                orderBy
            })


        const totalValue = await this.donationsRepository.countDonationsValuesForWorker(
            id,
            {
                startDate: startD,
                endDate: endD,
            }
        )

        if (!donations) {
            throw new AppError("No Donation found")
        }


        return {
            worker,
            donations,
            totalValue
        }

    }


}
export { WorkerContribuitionsUseCase }
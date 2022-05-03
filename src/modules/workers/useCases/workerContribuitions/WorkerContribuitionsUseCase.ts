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


        if (!startDate) startDate = this.dateProvider.addOrSubtractTime("sub", "month", 1).toString()

        if (!endDate) endDate = this.dateProvider.dateNow().toString()

        let startD = this.dateProvider.convertToDate(startDate)
        let endD = this.dateProvider.convertToDate(endDate)

        if (startD === endD) endD = this.dateProvider.addOrSubtractTime("add", "minute", 1439, endD)

        if (this.dateProvider.IsToday(endD)) endD = this.dateProvider.addOrSubtractTime("add", "minute", 1439, endD)

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


        if (!donations) {
            throw new AppError("No Donation found")
        }

        //somar valor 
        // let sumValues

        // donations.forEach(donation => {
        //     sumValues += donation.donation_value.valueOf()
        // })

        //console.log(sumValues)
        return {
            worker,
            donations
        }

    }


}
export { WorkerContribuitionsUseCase }
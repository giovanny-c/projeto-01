import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IFindOptions } from "../../dtos/IFindOptionsDTO";
import { Donation } from "../../entities/donation";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";


interface IRequest {
    value: string
    orderBy: string
    limit: number
    offset: number
    startDate: string
    endDate: string
}

@injectable()
class ListDonationsUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute({ value, orderBy, limit, offset, startDate, endDate }: IRequest): Promise<Donation[]> {

        if (orderBy !== "ASC") orderBy = "DESC"



        if (!limit || limit === 0) limit = 10
        if (!offset) offset = 0

        if (limit.valueOf !== Number) throw new AppError("this is not a valid limit")
        if (offset.valueOf !== Number) throw new AppError("this is not a valid offset")

        if (!startDate) {
            startDate = "2000-01-01"
        }
        if (!endDate) {
            endDate = "3000-01-01"
        }

        const startD = this.dateProvider.convertToDate(startDate)
        const endD = this.dateProvider.convertToDate(endDate)

        return await this.donationsRepository.findDonationsByDonorNameOrEmail({
            value,
            orderBy,
            limit,
            offset,
            startDate: startD,
            endDate: endD
        })


    }
}

export { ListDonationsUseCase }
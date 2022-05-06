import dayjs from "dayjs";
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

        //if ( se nao for number ) throw new AppError("this is not a valid limit")
        //if (offset.valueOf !== Number) throw new AppError("this is not a valid offset")

        //se nao tiver data inicial cria uma data 1 mes antes da atual
        if (!startDate) startDate = this.dateProvider.addOrSubtractTime("sub", "month", 1).toString()
        //se nao tiver data final cria uma do dia atual + 23:59 min
        if (!endDate) endDate = this.dateProvider.addOrSubtractTime("add", "minute", 1439).toString()

        //converte para data
        let startD = this.dateProvider.convertToDate(startDate)
        let endD = this.dateProvider.addOrSubtractTime("add", "minute", 1439, this.dateProvider.convertToDate(endDate))

        //if (startD === endD) endD = this.dateProvider.addOrSubtractTime("add", "day", 1, endD)

        //if (this.dateProvider.IsToday(endD)) endD = this.dateProvider.addOrSubtractTime("add", "minute", 1439, endD)


        return await this.donationsRepository.findDonationsBy({
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
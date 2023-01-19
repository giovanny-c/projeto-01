import dayjs from "dayjs";
import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IFindOptions } from "../../dtos/IFindOptionsDTO";
import { Donation } from "../../entities/donation";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";


interface IRequest {
    
    orderBy: string
    limit: number
    page: number
    startDate: string | Date
    endDate: string | Date
    ngo_id: string
    donor_name: string
    worker_name: string
}

interface IResponse {
    ngo: Ngo
    donations: Donation[],
    sum: number
    search_terms: {
        orderBy: string
        limit: number
        page: number
        startDate: string | Date
        endDate: string | Date
        ngo_id: string
        donor_name: string
        worker_name: string
    }
}


@injectable()
class ListDonationsUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository
    ) { }

    async execute({ orderBy, limit, page, startDate, endDate, ngo_id, worker_name, donor_name }: IRequest): Promise<IResponse> {


        let ngo: Ngo = JSON.parse(await this.cacheProvider.getRedis(`ngo-${ngo_id}`))

        if(!ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }

        if (orderBy !== "ASC") orderBy = "DESC"


        page = page || 1
        limit = limit || 30
        
        let offset = limit * (page - 1)

        //if ( se nao for number ) throw new AppError("this is not a valid limit")
        //if (offset.valueOf !== Number) throw new AppError("this is not a valid offset")

        //se nao tiver data inicial cria uma data 1 mes antes da atual
        if (!startDate) startDate = this.dateProvider.addOrSubtractTime("sub", "month", 1).toString()
        //se nao tiver data final cria uma do dia atual + 23:59 min
        if (!endDate) endDate = this.dateProvider.addOrSubtractTime("add", "minute", 1439).toString()

        //converte para data
        let start_date = this.dateProvider.convertToDate(startDate)
        let end_date = this.dateProvider.addOrSubtractTime("add", "minute", 1439, this.dateProvider.convertToDate(endDate))

        //if (startD === endD) endD = this.dateProvider.addOrSubtractTime("add", "day", 1, endD)

        //if (this.dateProvider.IsToday(endD)) endD = this.dateProvider.addOrSubtractTime("add", "minute", 1439, endD)
        
        

        const [donations, sum] =  await this.donationsRepository.findDonationsBy({
            ngo_id,
            worker_name,
            donor_name,
            orderBy: orderBy as "ASC" | "DESC",
            limit,
            offset,
            startDate: start_date,
            endDate: end_date
        })

        
        return {
            donations,
            sum,
            ngo,
            search_terms:{
                ngo_id,
                donor_name,
                worker_name,
                startDate,
                endDate,
                orderBy,
                limit,
                page,
            }
        }

    }
}

export { ListDonationsUseCase }
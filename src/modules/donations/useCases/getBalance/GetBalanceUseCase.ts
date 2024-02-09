import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Worker } from "../../../workers/entities/worker";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { Donation } from "../../entities/donation";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

//para o get
interface IRequest {
    ngo_id: string
    startDate: string | Date
    endDate: string | Date
    worker_id?: string
    limit: number
    page: number
    orderBy: string
}

interface IResponse{
    ngo: Ngo,
    workers: Worker[]
    donations: Donation[]
    sum: number
    search_terms: {
        orderBy: string
        limit: number
        page: number
        startDate: string | Date
        endDate: string | Date
        ngo_id: string
        worker_id?: string
    }
    
}

@injectable()
class GetBalanceUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty

    ){

    }   

    async execute({ngo_id, startDate, endDate, worker_id, limit, orderBy, page}: IRequest):Promise<IResponse>{

        let ngo: Ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo || !ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }

        if (orderBy !== "ASC") orderBy = "DESC"


        page = page || 1
        limit = limit || 30
        
        let offset = limit * (page - 1)

        const workers = await this.workersRepository.find()

        //se nao tiver data final cria uma do momento atal, se tiver poe 86399 segundo a ela
        !endDate ? endDate = this.dateProvider.dateNow() :  endDate = this.dateProvider.addOrSubtractTime("add", "second", 86399, endDate)
        

        if(!startDate){
            
            startDate = this.dateProvider.formatDate(this.dateProvider.convertToDate( `${endDate.toString().slice(0,7)}-01`), "YYYY-MM-DD")

        }
        
        //se nao tiver data inicial cria uma data 1 mes antes da atual no formato yyyy-mm-dd
              
        //this.dateProvider.formatDate(this.dateProvider.addOrSubtractTime("sub", "month", 1), "YYYY-MM-DD")
       
       
        
        //ja tira os que estao cancelados
        const {donations, sum} =  await this.donationsRepository.countDonationsValues({
            ngo_id,
            worker_id,
            startDate: startDate as Date,
            endDate,
            limit,
            offset,
            orderBy: orderBy as "ASC" | "DESC",
        })
      
        //COLOCAR NUMERO DE RECIBOS RETORNADOS, E VER SE O LIMIT NAO TA 
        //ATRAPALHANDO O COUNT 
        return {
            ngo,
            workers,
            donations,
            sum,
            search_terms: {
                ngo_id,
                startDate,
                endDate:  this.dateProvider.formatDate(endDate as Date, "YYYY-MM-DD"),
                worker_id,
                limit,
                page,
                orderBy
            }
        }
    }

}

export {GetBalanceUseCase}
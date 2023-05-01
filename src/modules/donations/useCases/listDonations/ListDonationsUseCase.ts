
import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Donation } from "../../entities/donation";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";
import { User } from "../../../user/entities/user";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { Worker } from "../../../workers/entities/worker";



interface IRequest {
    
    orderBy: string
    limit: number
    page: number
    donation_number: number
    startDate: string | Date
    endDate: string | Date
    ngo_id: string
    donor_name: string
    worker_id: string
    user: Partial<User>
}

interface IResponse {
    ngo: Ngo
    donations: Donation[],
    workers: Worker[],
    search_terms: {
        donation_number: number
        orderBy: string
        limit: number
        page: number
        startDate: string | Date
        endDate: string | Date
        ngo_id: string
        donor_name: string
        worker_id: string
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
        private ngoRepository: INgoRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty

    ) { }

    async execute({ orderBy, limit, page, startDate, endDate, ngo_id, worker_id, donor_name, donation_number, user }: IRequest): Promise<IResponse> {


        let ngo: Ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }

        //se o user nao for admin
        if(!user.admin){

            if(!user.id){
                throw new AppError("Usuario nao encontrado.")
            }

            worker_id = (await this.usersRepository.findById(user.id)).worker.id
            console.log(worker_id)

            if(!worker_id || worker_id === ""){
                throw new AppError("Nao foram encontradas doações para esse funcionário, ou ele nao existe")
            }
        }


        if (orderBy !== "ASC") orderBy = "DESC"


        page = page || 1
        limit = limit || 30
        
        let offset = limit * (page - 1)

        //if ( se nao for number ) throw new AppError("this is not a valid limit")
        //if (offset.valueOf !== Number) throw new AppError("this is not a valid offset")

        //se nao tiver data inicial cria uma data 1 mes antes da atual no formato yyyy-mm-dd
        // if (!startDate) startDate = this.dateProvider.formatDate(this.dateProvider.addOrSubtractTime("sub", "month", 1), "YYYY-MM-DD")
        
        //se nao tiver data final cria uma do momento atal, se tiver poe 86399 segundo a ela
        !endDate ? endDate = this.dateProvider.dateNow() :  endDate = this.dateProvider.addOrSubtractTime("add", "second", 86399, endDate)
       

        const donations =  await this.donationsRepository.findDonationsBy({
            ngo_id,
            worker_id,
            donor_name,
            donation_number,
            orderBy: orderBy as "ASC" | "DESC",
            limit,
            offset,
            startDate: startDate as Date,
            endDate: endDate as Date
        })


        const workers = await this.workersRepository.find()


        
        
        return {
            donations,
            ngo,
            workers,
            search_terms:{
                donation_number,
                ngo_id,
                donor_name,
                worker_id,
                startDate,
                endDate: this.dateProvider.formatDate(endDate as Date, "YYYY-MM-DD"),
                orderBy,
                limit,
                page,
            }
        }

    }
}

export { ListDonationsUseCase }
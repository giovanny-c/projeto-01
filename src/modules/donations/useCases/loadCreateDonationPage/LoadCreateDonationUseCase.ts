import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";

import { AppError } from "../../../../shared/errors/AppError";
import { Worker } from "../../../workers/entities/worker";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { DonationCounter } from "../../entities/donation_counter";

import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";


interface IRequest {
   id: string
   user_id: string
}

interface IResponse {
    
    ngo: Ngo
    ngo_donation_counter: DonationCounter | Partial<DonationCounter>
    workers: Worker[]
    date: Date
}

@injectable()
class LoadCreateDonationUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,

    ) { }

    async execute({id, user_id}: IRequest): Promise<IResponse> {
        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${id}`))

        if(!ngo || !ngo.id){
            ngo =  await this.ngoRepository.findById(id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }

        
        const counter = await this.donationCounterRepository.findByNgoId(ngo.id)

        const user = await this.usersRepository.findById(user_id)

        if(!user){
            throw new AppError("Usuário não encontrado")
        }
        
        const date = this.dateProvider.formatDate(this.dateProvider.dateNow(), "YYYY-MM-DD")
        


        const workers = await this.workersRepository.find()

        return  {
            ngo,
            ngo_donation_counter: counter,
            workers: !user.worker_id ? workers : [user.worker],
            date
        }
        
    
    }

}

export { LoadCreateDonationUseCase }
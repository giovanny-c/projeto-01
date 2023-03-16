import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";

import { AppError } from "../../../../shared/errors/AppError";
import { Worker } from "../../../workers/entities/worker";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { DonationCounter } from "../../entities/donation_counter";

import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";


interface IRequest {
   id: string
}

interface IResponse {
    
    ngo: Ngo
    ngo_donation_counter: DonationCounter | Partial<DonationCounter>
    workers: Worker[]
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
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty

    ) { }

    async execute({id}: IRequest): Promise<IResponse> {
        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }

        
        const counter = await this.donationCounterRepository.findByNgoId(ngo.id)

        const workers = await this.workersRepository.find()

        return  {
            ngo,
            ngo_donation_counter: counter,
            workers
        }
        
    
    }

}

export { LoadCreateDonationUseCase }
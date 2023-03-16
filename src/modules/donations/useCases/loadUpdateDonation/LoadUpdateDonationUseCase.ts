
import { inject, injectable } from "tsyringe";

import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";

import { AppError } from "../../../../shared/errors/AppError";
import { Donation } from "../../entities/donation";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { Worker } from "../../../workers/entities/worker";

interface IRequest{
    ngo_id: string
    donation_number: number
}

interface IResponse {
    donation: Donation
    ngo: Ngo
    workers: Worker[]
   
}


@injectable()
class LoadUpdateDonationUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
    ) {

    }

    async execute({donation_number, ngo_id}: IRequest): Promise<IResponse> {
        
        if(!donation_number || typeof donation_number !== "number"){
            throw new AppError("Doação nao encontrada", 404)
        }    

        let ngo: Ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }

    
        const donation = await this.donationsRepository.findDonationByNumberAndNgoId({donation_number, ngo_id})


        if (!donation || !donation.id) {
            throw new AppError("Doação nao encontrada", 404)
        }

        if(donation.ngo_id !== ngo.id){
            throw new AppError("Doacão nao encontrada, ou nao existe", 400)
        }

        const workers = await this.workersRepository.find()
        
        // await this.fileProvider.generateFile(donation, true)


        
    
        return {   
            donation,
            ngo, 
            workers
        }
    }


}

export { LoadUpdateDonationUseCase }
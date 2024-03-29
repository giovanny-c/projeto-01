import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";

import { AppError } from "../../../../shared/errors/AppError";
import { DonationCounter } from "../../entities/donation_counter";

import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";
import path from "path"


interface IRequest {
   ngo_id: string
}

interface IResponse {
    ngo: Ngo
    file_path: string
    file_name: string
}

@injectable()
class LoadImportDonationsUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider

    ) { }

    async execute({ngo_id}: IRequest): Promise<IResponse> {
        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo || !ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }   

        
        
        return  {
            ngo,
            file_path: "./examples/exemplo_importar_doaçao.xlsx",
            file_name: "exemplo_importar_doaçao"
        }
    
    }

}

export { LoadImportDonationsUseCase }
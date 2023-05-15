import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest{
    ngo_id: string

}


@injectable()
class LoadExportDonationsUseCase{

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        ){

    }

    async execute({ngo_id}: IRequest){
        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo || !ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }


        return {
            ngo

        }
        
    }   

}
export{LoadExportDonationsUseCase}
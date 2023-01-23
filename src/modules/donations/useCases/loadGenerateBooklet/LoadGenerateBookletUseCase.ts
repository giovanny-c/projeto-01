import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { DonationCounter } from "../../entities/donation_counter";
import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest{
    ngo_id: string
}

interface IResponse{

    ngo: Ngo
    donation_counter: DonationCounter
}

@injectable()
class LoadGenerateBookletUseCase{

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
        ){

    }

    async execute({ngo_id}: IRequest): Promise<IResponse>{
        
        let ngo = JSON.parse(await this.cacheProvider.getRedis(`ngo-${ngo_id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }


        let dir = "./tmp/booklet/"
        const contents = await this.storageProvider.getFiles(dir)

       

        const donation_counter = await this.donationCounterRepository.findByNgoId(ngo_id)
        
        return {
            ngo,
            donation_counter
        }
        
    }   

}
export{LoadGenerateBookletUseCase}
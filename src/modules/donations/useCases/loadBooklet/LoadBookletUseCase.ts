import { inject, injectable } from "tsyringe";
import { getExecutionTime } from "../../../../../utils/decorators/executionTime";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest{
    ngo_id: string
    month: string
    year: string
    file_name: string
}

interface IResponse{

    ngo: Ngo
    file: string | Buffer
    file_name: string
    
}


@injectable()
class LoadBookletUseCase {


   
    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ){

    }
    
    @getExecutionTime()
    async execute({ngo_id, file_name, month, year}: IRequest): Promise<IResponse>{
        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }   


        let dir = `./tmp/booklet/${year}/${month}/${ngo.name}/`


        
        
        
        let file = await this.storageProvider.getFile(dir, file_name, true) as string
        
        

        return {
            ngo,
            file,
            file_name
        }
        
    }  
}

export {LoadBookletUseCase}
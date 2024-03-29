import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { Ngo } from "../../entities/ngos";
import { INgoRepository } from "../../repositories/INgoRepository";

import * as fsPromises from "fs/promises"

interface IRequest{
    ngo_id: string
    month: string
    year: string
    file_name: string
}

interface IResponse{

    ngo: Ngo
    file_name: string
    file_path: string
    
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
    
   
    async execute({ngo_id, file_name, month, year}: IRequest): Promise<IResponse>{
        
        let ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo || !ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }       

        const file_path = `tmp/booklet/${year}/${month}/${ngo.name}/${file_name}`   
        
        try { 
            await fsPromises.access(file_path)
        } catch (error) {
            console.error(error)
            throw new AppError("Não foi possivel encontrar o arquivo, ou ele não existe", 500)
        }
        

        return {
            ngo,
            file_name,
            file_path
        }
        
    }  
}

export {LoadBookletUseCase}
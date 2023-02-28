import { instanceToPlain } from "class-transformer";
import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { Ngo } from "../../entities/ngos";
import { INgoRepository } from "../../repositories/INgoRepository";


@injectable()
class FindAllNgosUseCase {


    constructor(
        @inject("NgoRepository")
        private ngosRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider, 
    ){

    }

    async execute(): Promise<Ngo[]>{
        
        const ngos = await this.ngosRepository.findAll()

        ngos.forEach(async(ngo) => {

            

            await this.cacheProvider.setRedis(`ngo-${ngo.id}`, JSON.stringify(instanceToPlain(ngo)))
        });

        return ngos
    }
}

export {FindAllNgosUseCase}
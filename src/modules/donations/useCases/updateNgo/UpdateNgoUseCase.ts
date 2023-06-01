import { instanceToPlain } from "class-transformer";
import { inject, injectable } from "tsyringe";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { INgoRepository } from "../../repositories/INgoRepository";


interface IRequest{
    name: string
     full_name: string
     id: string
}

@injectable()
class UpdateNgoUseCase{

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider
    ){

    }

    async execute({full_name, id, name}:IRequest){

        if(!full_name || full_name === ""){
            throw new AppError("Forneça um nome valido para a instituição", 400)
        }
        if(!name || name === ""){
            throw new AppError("Forneça uma abreviação ou acrônimo valido para a instituição", 400)
        }
        
        if(!id || id === "" ) throw new AppError("Não foi possivel encontrar a instituição")


        if(name.match(/[\\\/:*?<>|",]/)){
            throw new AppError(`Caracter invalido: "${name.match(/[\\\/:*?<>|",]/)[0]}" .Forneça uma abreviação ou acrônimo valido para a instituição`, 400)
        }
       

        const ngo = await this.ngoRepository.findById(id)

        const FoundNgos = await this.ngoRepository.findAll()
        
        FoundNgos.filter(FoundNgo => {
            if(FoundNgo.name === name && FoundNgo.id !== ngo.id){
                throw new AppError("Ja existe uma instituição com esse nome")
            }
        })

        const updatedNgo = await this.ngoRepository.create({
            ...ngo,
            name, 
            full_name, 
        })

        await this.cacheProvider.set(`ngo-${ngo.id}`, JSON.stringify(instanceToPlain(updatedNgo)))


        return {ngo: updatedNgo}
    }
}

export {UpdateNgoUseCase}
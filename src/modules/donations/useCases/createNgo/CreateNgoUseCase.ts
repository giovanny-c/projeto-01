import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";

import { Ngo } from "../../entities/ngos";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest {
    name: string
    full_name: string
    alias: string
}

@injectable()
class CreateNgoUseCase {


    constructor(
       
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
    ) { }

    async execute({ full_name, name, alias}: IRequest) {


        if(!full_name || full_name === ""){
            throw new AppError("Forneça um nome valido para a instituição", 400)
        }
        if(!name || name === ""){
            throw new AppError("Forneça uma abreviação ou acrônimo valido para a instituição", 400)
        }
        if(!alias || alias === ""){
            throw new AppError("Forneça um nome de sistema valido para a instituição", 400)
        }

        if(name.match(/[\\\/:*?<>|",]/)){
            throw new AppError(`Caracter invalido: "${name.match(/[\\\/:*?<>|",]/)[0]}".Forneça uma abreviação ou acrônimo valido para a instituição`, 400)
        }
        if(alias.match(/[\\\/:*?<>|",]/g)){
            throw new AppError(`Caracter invalido: "${name.match(/[\\\/:*?<>|",]/)[0]}".Forneça um nome de sistema valido para a instituição`, 400)
        }

        const ngoExists = await this.ngoRepository.findByName(name)

        if (ngoExists) {
            throw new AppError("essa instituição ja existe", 400)

        }

        
        
        await this.ngoRepository.create({full_name, name, alias})

          
        
        

    }

}

export { CreateNgoUseCase }
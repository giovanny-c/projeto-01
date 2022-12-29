import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";

import { Ngo } from "../../entities/ngos";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest {
    name: string
    full_name: string
    
}

@injectable()
class CreateNgoUseCase {


    constructor(
       
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
    ) { }

    async execute({ full_name, name}: IRequest): Promise<Ngo> {



        const ngoExists = await this.ngoRepository.findByName(name)

        if (ngoExists) {
            throw new AppError("essa instituição ja existe")

        }

        
        const ngo = await this.ngoRepository.create(name, full_name)

        return ngo  
        
        

    }

}

export { CreateNgoUseCase }
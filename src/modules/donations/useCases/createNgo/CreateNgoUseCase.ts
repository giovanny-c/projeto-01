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

    async execute({ full_name, name, alias}: IRequest): Promise<Ngo> {



        const ngoExists = await this.ngoRepository.findByName(name)

        if (ngoExists) {
            throw new AppError("essa instituição ja existe", 400)

        }

        
        const ngo = await this.ngoRepository.create(name, full_name, alias)

        return ngo  
        
        

    }

}

export { CreateNgoUseCase }
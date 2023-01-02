import { inject, injectable } from "tsyringe";
import { Ngo } from "../../entities/ngos";
import { INgoRepository } from "../../repositories/INgoRepository";


@injectable()
class FindAllNgosUseCase {


    constructor(
        @inject("NgoRepository")
        private ngosRepository: INgoRepository 
    ){

    }

    async execute(): Promise<Ngo[]>{

        return await this.ngosRepository.findAll()
    }
}

export {FindAllNgosUseCase}
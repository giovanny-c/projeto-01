import { inject, injectable } from "tsyringe";
import { DonationCounter } from "../../entities/donation_counter";
import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IResponse {
    ngo: Ngo
    ngo_donation_counter: DonationCounter
}

@injectable()
class GetNgoUseCase {

    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository
    ){

    }

    async execute(name: string){

        const ngo = await this.ngoRepository.findByName(name)

        const ngo_donation_counter = await this.donationCounterRepository.findByNgoId(ngo.id)


        return {ngo, ngo_donation_counter}


    }

    
}
export {GetNgoUseCase}
import { off } from "pdfkit";
import { inject, injectable } from "tsyringe";
import { Donor } from "../../entities/donor";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";

@injectable()
class ListDonorsUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository
    ) {

    }

    async execute(value?: string, limit?: number, page?: number) {


        page = page || 1
        limit = limit || 30
        
        let offset = limit * (page - 1)

        const donors = await this.donorsRepository.findBy(value, +(limit), offset)

        

        return {
            donors,
            search_terms: {
                value,
                page,
                limit
            }
            
        }
    }
}

export { ListDonorsUseCase }
import { String } from "aws-sdk/clients/apigateway";
import { off } from "pdfkit";
import { inject, injectable } from "tsyringe";
import { Donor } from "../../entities/donor";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";

interface IRequest{
    value?: string
    limit?: number
    page?: number
    user_id: string
    is_admin: boolean
}

@injectable()
class ListDonorsUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository
    ) {

    }

    async execute({value, limit, page, user_id, is_admin}: IRequest) {


        page = page || 1
        limit = limit || 30
        
        let offset = limit * (page - 1)

        const donors = await this.donorsRepository.findBy(value, +(limit), offset, user_id)

        let filteredDonors = donors

        if(!is_admin){

            filteredDonors = donors.filter((donor)=>{
                
                if(donor.user?.id === user_id || donor.user?.admin || !donor.user){
                    return donor
                }
                

            }) 
    
        }
        

        return {
            donors: filteredDonors,
            search_terms: {
                value,
                page,
                limit
            }
            
        }
    }
}

export { ListDonorsUseCase }
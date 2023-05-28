import { String } from "aws-sdk/clients/apigateway";
import { off } from "pdfkit";
import { inject, injectable } from "tsyringe";
import { Donor } from "../../entities/donor";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import { instanceToPlain } from "class-transformer";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";

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
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
    ) {

    }

    async execute({value, limit, page, user_id, is_admin}: IRequest) {


        page = page || 1
        limit = limit || 30
        
        
        let offset = limit * (page - 1)

        const user = instanceToPlain(await this.usersRepository.findById(user_id))
        const donors = instanceToPlain(await this.donorsRepository.findBy(value, +(limit), offset, user_id)) as Donor[]

        let filteredDonors = donors
        console.log(donors)
        
        if(!is_admin){

            filteredDonors = donors.filter((donor)=>{
                //se foi criado pelo user, se foi criado por um admin(mas foi atribuido ao worker desse user ou a nenhum user), se nao possuir user(só old)
                if(donor.user?.id === user.id){
                    return donor
                }
                if(donor.user?.admin && (donor.worker?.id === user.worker_id || donor.worker?.id === null)){
                    return donor
                }
                if(!donor.user){
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
import { json } from "express";
import { inject, injectable } from "tsyringe";
import { getExecutionTime } from "../../../../../utils/decorators/executionTime";
import { Donor } from "../../entities/donor";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";




@injectable()
class FilterDonorsUseCase {


    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository
    ){}

    
    async execute(value: string): Promise<void | Partial<Donor>[]>{

        if(!value || value.length < 1){

            return
        }

        
        
        
        let donors = (await this.donorsRepository.findBy(value, 12, 0)).map(donor => {
        

            return {
                id: donor.id,
                name: donor.name,
                email: donor.email
            }

        }) 

        // para ir na ordem do valor
        // ex: t
        // t1, t2, t3, at, bt, ct,
        donors.sort((a, b) => {
            
           
            if(a.name.toLowerCase().startsWith(value) && !b.name.toLowerCase().startsWith(value)){
                return -1 
            }
            if(!a.name.toLowerCase().startsWith(value) && b.name.toLowerCase().startsWith(value) ){
                return 1 
            }
            if(a.name.toLowerCase().startsWith(value) && b.name.toLowerCase().startsWith(value)){
                return 0
            }
            if(!a.name.toLowerCase().startsWith(value) && !b.name.toLowerCase().startsWith(value)){
                return 0
            }
        })

        
        
        
        return donors

    }

   



}

export {FilterDonorsUseCase}